import fetch from 'isomorphic-unfetch';
import { Result } from './Result';

const DISCORD_API_ENDPOINT = 'https://discord.com/api/v6';

const OAUTH_ID = process.env.DISCORD_OAUTH_ID ?? 'NOT_PROVIDED';
const OAUTH_SECRET = process.env.DISCORD_OAUTH_SECRET ?? 'NOT_PROVIDED';
const SCOPE = 'identify email guilds';
const REDIRECT_URI =
    process.env.NODE_ENV === 'production'
        ? 'https://untitled-discord-attempt.now.sh/api/login'
        : 'http://localhost:3000/api/login';

export const OAUTH_URL = (() => {
    const query = new URLSearchParams();
    query.set('client_id', OAUTH_ID);
    query.set('redirect_uri', REDIRECT_URI);
    query.set('scope', SCOPE);
    query.set('response_type', 'code');
    query.set('prompt', 'none');

    return `${DISCORD_API_ENDPOINT}/oauth2/authorize?${query}`;
})();

export interface TokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    token_type: string;
}

export const getToken = (input: string, type: 'grant' | 'refresh') => {
    const body = new URLSearchParams();

    body.set('client_id', OAUTH_ID);
    body.set('client_secret', OAUTH_SECRET);
    body.set('scope', SCOPE);
    body.set('redirect_uri', REDIRECT_URI);
    body.set(
        {
            grant: 'code',
            refresh: 'refresh_token',
        }[type],
        input,
    );
    body.set(
        'grant_type',
        {
            grant: 'authorization_code',
            refresh: 'refresh_token',
        }[type],
    );

    return Result.fromTryAsync(() =>
        fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
            method: 'POST',
            body,
        })
            .then((res) => res.json())
            .then((body) => body as TokenResponse),
    );
};

const fetchDiscord = <T>(uri: string, token: string) =>
    Result.fromTryAsync(() =>
        fetch(`${DISCORD_API_ENDPOINT}${uri}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => res.json())
            .then((body) => body as T),
    );

export interface UserResponse {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    email: string;
    verified: boolean;
    locale: string;
    mfa_enabled: boolean;
}

export const getUser = (token: string) =>
    fetchDiscord<UserResponse>('/users/@me', token);

export interface GuildResponse {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: string[];
}

export const getGuilds = (token: string) =>
    fetchDiscord<GuildResponse[]>('/users/@me/guilds', token);
