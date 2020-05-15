import { schema } from 'nexus';

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
