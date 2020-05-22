import { getToken, getUser, OAUTH_URL, getGuilds } from '../../util/discord';
import { PrismaClient } from '@prisma/client';
import { handleResult } from '../../util/requestHandlers';
import { expect } from '../../util/generic/Result';
import { I } from '../../util/generic/Identity';

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

    expect(userRes.verified, 'You must have a verified email!');

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

    const guilds = (await getGuilds(tokenRes.access_token)).expect(
        'Failed to get guilds.',
    );

    expect(
        process.env.NODE_ENV !== 'production',
        'You forgot to remove the test code idiot.',
    );

    // TODO: Remove the following
    await I(guilds)
        .map((guilds) =>
            guilds
                // .filter(({ owner }) => owner)
                .map(({ id, name, icon, features }) =>
                    db.serverEntry.upsert({
                        create: {
                            id,
                            owner: {
                                connect: {
                                    id: userRes.id,
                                },
                            },
                            name,
                            description: 'TODO',
                            icon,
                            features: {
                                set: features,
                            },
                        },
                        update: {
                            id,
                            name,
                            icon,
                            features: {
                                set: features,
                            },
                        },
                        where: {
                            id,
                        },
                    }),
                ),
        )
        .map((guilds) => Promise.all(guilds))
        .unwrap();

    res.json({ userRes });
});
