import fetch from 'isomorphic-unfetch';

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

export const getToken = async (
    input: string,
    type: 'grant' | 'refresh',
): Promise<TokenResponse | null> => {
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

    try {
        return await (
            await fetch(`${DISCORD_API_ENDPOINT}/oauth2/token`, {
                method: 'POST',
                body,
            })
        ).json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

const fetchDiscord = async (uri: string, token: string): Promise<unknown> => {
    try {
        return await (
            await fetch(`${DISCORD_API_ENDPOINT}${uri}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
        ).json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

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
    fetchDiscord('/users/@me', token) as Promise<UserResponse | null>;

export interface GuildResponse {
    id: string;
    name: string;
    icon: string;
    owner: boolean;
    permissions: number;
    features: string[];
}

export const getGuilds = (token: string) =>
    fetchDiscord('/users/@me/guilds', token) as Promise<GuildResponse[] | null>;
