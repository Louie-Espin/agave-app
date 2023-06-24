import { Fragment, useEffect } from 'react';
import MuiTheme from "theme/MuiTheme";
import Head from 'next/head';
import Router from 'next/router';
import type { AppProps } from 'next/app';

import AOS from "aos";
import "aos/dist/aos.css";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import "react-quill/dist/quill.snow.css";
import "simplebar-react/dist/simplebar.min.css";

import AppLayout from "layouts/AppLayout";

import initAuth from '@firebaseUtils/initAuth'

initAuth();

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

const App = ({ Component, pageProps }: AppProps) => {

    useEffect(() => {
        AOS.init();
        AOS.refresh();

        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) { jssStyles.parentElement!.removeChild(jssStyles) }
    }, []);

    return (
        <Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta charSet="utf-8" />
                <link href="/favicon.jpg" rel="shortcut icon" type="image/x-icon"/>
                <title>Client Portal - Agave Environment Contracting, Inc.</title>

            </Head>
            <MuiTheme>
                {/*<AppLayout>*/}
                    <Component {...pageProps} />
                {/*</AppLayout>*/}
            </MuiTheme>
        </Fragment>
    );
}

export default App;