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
        <style jsx global>{`
            @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');

            :root {
                font-family: 'Roboto', sans-serif;
                background-color: #23272a;
                color: #ffffff;
                --card-bg: #2c2f33;
            }
        `}</style>
    </ApolloProvider>
);

export default withData(App);
