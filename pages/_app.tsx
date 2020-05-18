import React, { FC } from 'react';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/react-hooks';
import { withData, WithDataProps } from '../util/withData';

const App: FC<AppProps & WithDataProps> = ({
    Component,
    pageProps,
    apollo,
}) => (
    <ApolloProvider client={apollo}>
        <Component {...pageProps} />
    </ApolloProvider>
);

export default withData(App);
