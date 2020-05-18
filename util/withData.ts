import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink } from 'apollo-link';
import fetch from 'isomorphic-unfetch';
import { withApollo, WithApolloProps } from 'next-with-apollo';

const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
    fetch,
    uri:
        process.env.NODE_ENV === 'production'
            ? 'http://localhost/api/graphql'
            : 'http://localhost:3000/api/graphql',
});

export const withData = withApollo(
    ({ initialState }) =>
        new ApolloClient({
            link: ApolloLink.from([errorLink, httpLink]),
            cache: new InMemoryCache().restore(initialState ?? {}),
        }),
);

export type WithDataProps = WithApolloProps<InMemoryCache>;
