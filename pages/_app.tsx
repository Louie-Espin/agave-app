import { Fragment, useEffect } from 'react';
import MuiTheme from "theme/MuiTheme";
import Head from 'next/head';
import Router from 'next/router';
import type { AppProps } from 'next/app';

import nProgress from "nprogress";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "simplebar-react/dist/simplebar.min.css";

import initAuth from '@firebaseUtils/initAuth'

initAuth();

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

const App = ({ Component, pageProps }: AppProps) => {

    return (
        <Fragment>
            <Head>

                <meta name="application-name" content="Agave Communications" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Agave Communications" />
                <meta name="description" content="Web Portal - Agave Environmental Contracting Inc." />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/icons/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#2B5797" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#fff">
                <meta name="background-color" content="#79c37b" />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-512x512.png" />

                <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta charSet="utf-8" />
                <link href="/favicon.jpg" rel="shortcut icon" type="image/x-icon"/>
                <title>Client Portal - Agave Environmental Contracting, Inc.</title>

            </Head>
            <MuiTheme>
                <Component {...pageProps} />
            </MuiTheme>
        </Fragment>
    );
}

export default App;