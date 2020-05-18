import { schema, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

use(prisma());

schema.interfaceType({
    name: 'Node',
    definition(t) {
        t.id('id');
        t.resolveType(() => null);
    },
});

schema.objectType({
    name: 'Todo',
    definition(t) {
        t.implements('Node');
        t.model.description();
    },
});

schema.queryType({
    definition(t) {
        t.crud.todos();
    },
});

schema.mutationType({
    definition(t) {
        t.crud.createOneTodo();
        t.crud.deleteOneTodo();
    },
});
