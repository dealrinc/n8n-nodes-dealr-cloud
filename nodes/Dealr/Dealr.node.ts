import type {
    IDataObject,
    ILoadOptionsFunctions,
    INodeListSearchResult,
    INodeProperties,
    INodePropertyOptions,
    INodeType,
    INodeTypeDescription,
    PostReceiveAction,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { api, authenticationProperty, credentialFor, credentials, icon, requestHeaders } from '../shared/api';
import { choiceLabel } from '../shared/records';
import { idempotencyKey, paginateByCursor, simplify } from '../shared/runtime';
import { properties, resources } from './generated/properties';

// Every resource, operation and field below comes from generated/properties.ts,
// which the Dealr public API's own build writes. This file adds what a literal
// cannot hold: the Idempotency-Key every write must carry, the Simplify step,
// cursor pagination for Return All, and the pick-list search behind each
// record's "From List" mode.

const PICK_LIST_PAGE_SIZE = 50;

function withRuntime(generated: INodeProperties[]): INodeProperties[] {
    return generated.map((property) => {
        if (property.name !== 'operation' || !Array.isArray(property.options)) return property;
        const options = (property.options as INodePropertyOptions[]).map((option) => {
            const routing = option.routing;
            if (!routing) return option;
            if (routing.request?.method !== 'GET') {
                return { ...option, routing: { ...routing, send: { ...routing.send, preSend: [idempotencyKey] } } };
            }
            const postReceive = [...((routing.output?.postReceive ?? []) as PostReceiveAction[]), simplify];
            const operations = routing.send?.paginate ? { operations: { pagination: paginateByCursor } } : {};
            return { ...option, routing: { ...routing, ...operations, output: { ...routing.output, postReceive } } };
        });
        return { ...property, options };
    });
}

export class Dealr implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'dealr.cloud',
        name: 'dealr',
        icon,
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
        description: 'Look up vehicles, customers, leads, conversations and repair orders in dealr.cloud by Dealr, and add notes back',
        defaults: { name: 'dealr.cloud' },
        inputs: [NodeConnectionTypes.Main],
        outputs: [NodeConnectionTypes.Main],
        credentials,
        requestDefaults: { baseURL: api.baseUrl, headers: requestHeaders },
        usableAsTool: true,
        properties: [authenticationProperty, ...withRuntime(properties)],
    };

    methods = {
        listSearch: {
            async searchRecords(this: ILoadOptionsFunctions, filter?: string, paginationToken?: string): Promise<INodeListSearchResult> {
                const resource = resources[this.getCurrentNodeParameter('resource') as string];
                if (!resource) return { results: [] };
                const page = (await this.helpers.httpRequestWithAuthentication.call(
                    this,
                    credentialFor(this.getCurrentNodeParameter('authentication') ?? 'oAuth2'),
                    {
                        method: 'GET',
                        baseURL: api.baseUrl,
                        url: resource.listPath,
                        headers: requestHeaders,
                        qs: {
                            limit: PICK_LIST_PAGE_SIZE,
                            ...(filter ? { q: filter } : {}),
                            ...(paginationToken ? { cursor: paginationToken } : {}),
                        },
                        json: true,
                    },
                )) as { data?: IDataObject[]; has_more?: boolean; next_cursor?: string };
                return {
                    results: (page.data ?? []).map((record) => ({
                        name: choiceLabel(record, resource.choice),
                        value: String(record.id),
                        ...(typeof (record.links as IDataObject | undefined)?.app === 'string' ? { url: (record.links as IDataObject).app as string } : {}),
                    })),
                    ...(page.has_more && page.next_cursor ? { paginationToken: page.next_cursor } : {}),
                };
            },
        },
    };
}
