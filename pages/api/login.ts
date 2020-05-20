import { NowRequest, NowResponse } from '@now/node';
import { getToken, getUser, getGuilds, OAUTH_URL } from '../../util/discord';

export default async (req: NowRequest, res: NowResponse) => {
    const code = req.query.code;

    if (typeof code !== 'string') {
        res.writeHead(302, { Location: OAUTH_URL }).end();
        return;
    }

    const accessToken = (await getToken(code, 'grant'))?.access_token;

    if (typeof accessToken !== 'string') {
        res.status(400).send('OAuth grant failed.');
        res.end();
        return;
    }

    const userRes = await getUser(accessToken);
    const guildsRes = await getGuilds(accessToken);

    res.json({ userRes, guildsRes });
};
