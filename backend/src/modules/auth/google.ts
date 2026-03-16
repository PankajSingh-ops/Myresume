import crypto from 'crypto';
import { config } from '../../config/index';

export const GoogleHelpers = {
    generateStateToken(): string {
        return crypto.randomBytes(16).toString('hex');
    },

    buildGoogleAuthUrl(stateToken: string): string {
        const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        const params = new URLSearchParams({
            client_id: config.GOOGLE_CLIENT_ID,
            redirect_uri: config.GOOGLE_CALLBACK_URL,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            state: stateToken,
            prompt: 'consent',
        });

        return `${baseUrl}?${params.toString()}`;
    },
};
