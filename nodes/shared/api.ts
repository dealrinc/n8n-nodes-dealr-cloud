import type { INodeProperties } from 'n8n-workflow';

import api from '../../generated/api.json';

export { api };

export const OAUTH2_CREDENTIAL = 'dealrOAuth2Api';
export const API_KEY_CREDENTIAL = 'dealrApi';

/** OAuth for n8n Cloud; an organization API key for self-hosted n8n, whose callback Dealr does not register. */
export const authenticationProperty: INodeProperties = {
    displayName: 'Authentication',
    name: 'authentication',
    type: 'options',
    options: [
        { name: 'OAuth2', value: 'oAuth2', description: 'Sign in to dealr.cloud. For n8n Cloud.' },
        { name: 'Organization API Key', value: 'apiKey', description: 'A key a dealr.cloud admin creates. For self-hosted n8n.' },
    ],
    default: 'oAuth2',
};

export const credentials = [
    { name: OAUTH2_CREDENTIAL, required: true, displayOptions: { show: { authentication: ['oAuth2'] } } },
    { name: API_KEY_CREDENTIAL, required: true, displayOptions: { show: { authentication: ['apiKey'] } } },
];

export function credentialFor(authentication: unknown): string {
    return authentication === 'apiKey' ? API_KEY_CREDENTIAL : OAUTH2_CREDENTIAL;
}

/** The mark carries its own teal background, so one file reads on n8n's light and dark themes. */
export const icon = { light: 'file:../../icons/dealr.svg', dark: 'file:../../icons/dealr.svg' } as const;

export const requestHeaders = { Accept: 'application/json', 'Dealr-Version': api.apiVersion };
