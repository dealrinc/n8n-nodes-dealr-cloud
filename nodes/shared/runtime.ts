import { createHash } from 'crypto';

import type {
    DeclarativeRestApiSettings,
    IDataObject,
    IExecutePaginationFunctions,
    IExecuteSingleFunctions,
    IHttpRequestOptions,
    INodeExecutionData,
} from 'n8n-workflow';

import { resources } from '../Dealr/generated/properties';
import { credentialFor } from './api';
import { simplifyRecord } from './records';

// The Dealr node's request hooks. Kept free of runtime imports from n8n, so
// the connector tests drive them without n8n installed.

/**
 * The same key for the same item of the same run of the node, so n8n retrying
 * the node replays the write instead of writing it twice. The run index keeps
 * a node that runs more than once in an execution (a loop, an AI agent's tool
 * calls) from replaying its first write.
 */
export async function idempotencyKey(this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions): Promise<IHttpRequestOptions> {
    const itemIndex = this.getItemIndex();
    const runIndex = this.getWorkflowDataProxy(itemIndex).$runIndex;
    const key = createHash('sha256')
        .update(`${this.getExecutionId()}:${this.getNode().id}:${runIndex}:${itemIndex}`)
        .digest('hex');
    requestOptions.headers = { ...(requestOptions.headers ?? {}), 'Idempotency-Key': key };
    return requestOptions;
}

/** Keeps the resource's Simplify fields when the node's 'Simplify' is on. */
export async function simplify(this: IExecuteSingleFunctions, items: INodeExecutionData[]): Promise<INodeExecutionData[]> {
    if (!this.getNodeParameter('simplify', false)) return items;
    const fields = resources[this.getNodeParameter('resource') as string]?.simplify ?? [];
    return items.map((item) => ({ ...item, json: simplifyRecord(item.json, fields) }));
}

interface ListPage {
    data?: IDataObject[];
    has_more?: boolean;
    next_cursor?: string | null;
}

/**
 * Return All: follows `next_cursor` page by page. n8n's generic pagination
 * replaces the request's whole query string with the pagination request's, so
 * it would drop every filter, the sort and the page size; each page here keeps
 * them and adds the cursor.
 */
export async function paginateByCursor(
    this: IExecutePaginationFunctions,
    requestData: DeclarativeRestApiSettings.ResultOptions,
): Promise<INodeExecutionData[]> {
    const credential = credentialFor(this.getNodeParameter('authentication', 'oAuth2'));
    const records: IDataObject[] = [];
    let cursor: string | null = null;
    do {
        // Routing has already resolved every option to its final value.
        const request = requestData.options as IHttpRequestOptions;
        const options: IHttpRequestOptions = {
            ...request,
            qs: { ...(request.qs ?? {}), ...(cursor ? { cursor } : {}) },
            json: true,
            returnFullResponse: false,
        };
        const page = (await this.helpers.httpRequestWithAuthentication.call(this, credential, options)) as ListPage;
        records.push(...(page.data ?? []));
        cursor = page.has_more && page.next_cursor ? page.next_cursor : null;
    } while (cursor);
    return await simplify.call(this, records.map((json) => ({ json })));
}
