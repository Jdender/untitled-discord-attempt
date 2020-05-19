import { NowRequest, NowResponse } from '@now/node';
import fetch from 'isomorphic-unfetch';

export default async (req: NowRequest, res: NowResponse) => {
    const tokenRes = fetch('https://discordapp.com/api/oauth2/token', {
        method: 'POST',
        body: JSON.stringify({
            code: req.query.code,
            scope: 'identity email guilds',
            /* eslint-disable @typescript-eslint/camelcase */
            client_id: process.env.DISCORD_OAUTH_ID,
            client_secret: process.env.DISCORD_OAUTH_SECRET,
            grant_type: 'authorization_code',
            redirect_url: 'https://untitled-discord-attempt.now.sh/api/login',
            /* eslint-enable @typescript-eslint/camelcase */
        }),
    }).then((res) => res.json());
    res.json(tokenRes);
};
