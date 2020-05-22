import { getToken, getUser, OAUTH_URL } from '../../util/discord';
import { PrismaClient } from '@prisma/client';
import { handleResult } from '../../util/requestHandlers';

const db = new PrismaClient();

export default handleResult(400, async (req, res) => {
    const code = req.query.code;

    if (typeof code !== 'string') {
        res.writeHead(302, { Location: OAUTH_URL }).end();
        return;
    }

    const tokenRes = (await getToken(code, 'grant')).expect(
        'OAuth grant failed.',
    );

    const userRes = (await getUser(tokenRes.access_token)).expect(
        'Failed to fetch user information.',
    );

    await db.user.upsert({
        create: {
            id: userRes.id,
            username: userRes.username,
            discriminator: userRes.discriminator,
            email: userRes.email,
            avatar: userRes.avatar,
            refreshToken: tokenRes.refresh_token,
        },
        update: {
            username: userRes.username,
            discriminator: userRes.discriminator,
            email: userRes.email,
            avatar: userRes.avatar,
        },
        where: {
            id: userRes.id,
        },
    });

    res.json({ userRes });
});
