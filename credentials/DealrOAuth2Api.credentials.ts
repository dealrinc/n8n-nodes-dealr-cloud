import type { ICredentialType, INodeProperties } from 'n8n-workflow';

import api from '../generated/api.json';

// Dealr registers n8n Cloud's one OAuth callback for the `dealr-n8n` client
// (utility\OAuthClientRegistry), so there is nothing for a user to fill in.
export class DealrOAuth2Api implements ICredentialType {
    name = 'dealrOAuth2Api';

    extends = ['oAuth2Api'];

    icon = { light: 'file:../icons/dealr.svg', dark: 'file:../icons/dealr.svg' } as const;

    displayName = 'dealr.cloud OAuth2 API';

    documentationUrl = 'https://docs.dealr.cloud/api';

    properties: INodeProperties[] = [
        { displayName: 'Grant Type', name: 'grantType', type: 'hidden', default: 'pkce' },
        { displayName: 'Authorization URL', name: 'authUrl', type: 'hidden', default: api.oauth.authUrl },
        { displayName: 'Access Token URL', name: 'accessTokenUrl', type: 'hidden', default: api.oauth.accessTokenUrl },
        { displayName: 'Client ID', name: 'clientId', type: 'hidden', default: api.oauth.clientId },
        // A public PKCE client: dealr.cloud issues it no secret.
        { displayName: 'Client Secret', name: 'clientSecret', type: 'hidden', typeOptions: { password: true }, default: '' },
        { displayName: 'Scope', name: 'scope', type: 'hidden', default: api.oauth.scope },
        { displayName: 'Auth URI Query Parameters', name: 'authQueryParameters', type: 'hidden', default: api.oauth.authQueryParameters },
        { displayName: 'Authentication', name: 'authentication', type: 'hidden', default: 'body' },
    ];
}
