import { schema } from 'nexus';

console.log('URL = ', process.env.DATABASE_URL);

schema.queryType({
    definition(t) {
        t.field('ping', {
            type: 'String',
            async resolve(_root, _args, _ctx) {
                return 'Pong!';
            },
        });
    },
});
