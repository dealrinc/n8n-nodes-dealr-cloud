import { randomUUID } from 'crypto';

import type {
    IDataObject,
    IHookFunctions,
    IHttpRequestMethods,
    INodeType,
    INodeTypeDescription,
    IWebhookFunctions,
    IWebhookResponseData,
    JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeConnectionTypes } from 'n8n-workflow';

import { api, authenticationProperty, credentialFor, credentials, icon, requestHeaders } from '../shared/api';
import { events } from './generated/events';
import { verifyDeliverySignature } from '../shared/signature';
import { isNotFound, reconcileSubscription, subscriptionAlreadyGone, subscriptionsTo } from '../shared/subscriptions';

// One Dealr webhook subscription per active workflow, created on activation and
// deleted on deactivation. Dealr lets a Zapier or n8n connection manage only
// the subscriptions it made itself (utility\WebhookSubscriptions).

interface Subscription {
    id: string;
    url: string;
    events: string[];
    enabled?: boolean;
    secret?: string;
}

async function dealrRequest(
    this: IHookFunctions,
    method: IHttpRequestMethods,
    path: string,
    body?: IDataObject,
): Promise<Subscription> {
    const authentication = this.getNodeParameter('authentication', 'oAuth2') as string;
    return this.helpers.httpRequestWithAuthentication.call(
        this,
        credentialFor(authentication),
        {
            method,
            baseURL: api.baseUrl,
            url: `${api.basePath}/webhooks${path}`,
            json: true,
            headers: { ...requestHeaders, ...(method === 'GET' ? {} : { 'Idempotency-Key': randomUUID() }) },
            ...(body ? { body } : {}),
        },
    ) as Promise<Subscription>;
}


export class DealrTrigger implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'dealr.cloud Trigger',
        name: 'dealrTrigger',
        icon,
        group: ['trigger'],
        version: 1,
        subtitle: '={{$parameter["events"].join(", ")}}',
        description: 'Starts a workflow the moment a vehicle, lead or repair order changes in dealr.cloud by Dealr',
        defaults: { name: 'dealr.cloud Trigger' },
        inputs: [],
        outputs: [NodeConnectionTypes.Main],
        credentials,
        webhooks: [{ name: 'default', httpMethod: 'POST', responseMode: 'onReceived', path: 'webhook' }],
        properties: [
            authenticationProperty,
            {
                displayName: 'Trigger On',
                name: 'events',
                type: 'multiOptions',
                required: true,
                default: [],
                options: events,
            },
        ],
    };

    webhookMethods = {
        default: {
            async checkExists(this: IHookFunctions): Promise<boolean> {
                const data = this.getWorkflowStaticData('node');
                const id = typeof data.webhookId === 'string' ? data.webhookId : '';
                if (id === '') return false;

                const wanted = this.getNodeParameter('events') as string[];
                const url = this.getNodeWebhookUrl('default') as string;
                try {
                    const existing = await dealrRequest.call(this, 'GET', `/${encodeURIComponent(id)}`);
                    const action = reconcileSubscription(existing, url, wanted);
                    if (action === 'recreate') {
                        delete data.webhookId;
                        delete data.webhookSecret;
                        return false;
                    }
                    if (action === 'update') {
                        await dealrRequest.call(this, 'PATCH', `/${encodeURIComponent(id)}`, { events: wanted, enabled: true });
                    }
                    return true;
                } catch (error) {
                    if (!isNotFound(error)) throw new NodeApiError(this.getNode(), error as JsonObject);
                    delete data.webhookId;
                    delete data.webhookSecret;
                    return false;
                }
            },

            async create(this: IHookFunctions): Promise<boolean> {
                const workflow = this.getWorkflow();
                const url = this.getNodeWebhookUrl('default') as string;
                const existing = (await dealrRequest.call(this, 'GET', '')) as unknown as { data?: Subscription[] };
                for (const id of subscriptionsTo(existing.data ?? [], url)) {
                    try {
                        await dealrRequest.call(this, 'DELETE', `/${encodeURIComponent(id)}`);
                    } catch (error) {
                        if (!isNotFound(error)) throw new NodeApiError(this.getNode(), error as JsonObject);
                    }
                }
                const created = await dealrRequest.call(this, 'POST', '', {
                    url,
                    events: this.getNodeParameter('events') as string[],
                    description: `n8n: ${workflow.name ?? workflow.id ?? 'workflow'}`.slice(0, 255),
                });
                const data = this.getWorkflowStaticData('node');
                data.webhookId = created.id;
                data.webhookSecret = created.secret;
                return true;
            },

            async delete(this: IHookFunctions): Promise<boolean> {
                const data = this.getWorkflowStaticData('node');
                const id = typeof data.webhookId === 'string' ? data.webhookId : '';
                if (id !== '') {
                    try {
                        await dealrRequest.call(this, 'DELETE', `/${encodeURIComponent(id)}`);
                    } catch (error) {
                        if (!subscriptionAlreadyGone(error)) return false;
                    }
                }
                delete data.webhookId;
                delete data.webhookSecret;
                return true;
            },
        },
    };

    async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
        const request = this.getRequestObject() as ReturnType<IWebhookFunctions['getRequestObject']> & { rawBody?: Buffer };
        const payload = this.getBodyData();
        const data = this.getWorkflowStaticData('node');

        const verified = verifyDeliverySignature({
            secret: data.webhookSecret,
            timestamp: request.headers['x-dealr-timestamp'],
            signature: request.headers['x-dealr-signature'],
            // Dealr signs exactly JSON.stringify(payload), so re-serializing the
            // parsed body reproduces those bytes when n8n kept no raw copy.
            body: request.rawBody ? request.rawBody.toString('utf8') : JSON.stringify(payload),
        });
        if (!verified) {
            this.getResponseObject().status(401).send('Invalid Dealr signature');
            return { noWebhookResponse: true };
        }

        return { workflowData: [this.helpers.returnJsonArray(payload)] };
    }
}
