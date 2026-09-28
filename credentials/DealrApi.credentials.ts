import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';

import api from '../generated/api.json';

// An organization API key (created on the API Access settings page): the way a
// self-hosted n8n connects, and the only key that may manage the Dealr
// Trigger's webhook subscriptions.
export class DealrApi implements ICredentialType {
    name = 'dealrApi';

    icon = { light: 'file:../icons/dealr.svg', dark: 'file:../icons/dealr.svg' } as const;

    displayName = 'dealr.cloud API';

    documentationUrl = 'https://docs.dealr.cloud/api';

    properties: INodeProperties[] = [
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            typeOptions: { password: true },
            default: '',
            required: true,
            description: 'An organization API key, which starts dlr_live_. A dealr.cloud admin creates it on the API Access settings page.',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: { headers: { Authorization: '=Bearer {{$credentials.apiKey}}' } },
    };

    test: ICredentialTestRequest = {
        request: { baseURL: api.baseUrl, url: `${api.basePath}/me`, headers: { 'Dealr-Version': api.apiVersion } },
    };
}
