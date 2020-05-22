import { settings, schema, use } from 'nexus';
import { prisma } from 'nexus-plugin-prisma';

const HAS_NEXUS_INIT_KEY = Symbol('HAS_NEXUS_INIT');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (!(globalThis as any)[HAS_NEXUS_INIT_KEY]) {
    use(prisma());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (globalThis as any)[HAS_NEXUS_INIT_KEY] = true;
}

settings.change({
    schema: { generateGraphQLSDLFile: './.generated/schema.gql' },
});

schema.interfaceType({
    name: 'Node',
    definition(t) {
        t.id('id', { nullable: false });
        t.resolveType(() => null);
    },
});

schema.objectType({
    name: 'ServerEntry',
    definition(t) {
        t.implements('Node');
        t.model.name();
        t.model.description();
        t.model.icon();
        t.model.features();
    },
});

schema.queryType({
    definition(t) {
        t.crud.serverEntries();
    },
});
