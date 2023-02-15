import AOS from "aos";
import "aos/dist/aos.css";
import { AppProvider } from "contexts/AppContext";
import SettingsProvider from "contexts/SettingContext";
import { NextPage } from "next";
import { AppProps } from "next/app";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { Fragment, ReactElement, ReactNode, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "simplebar/dist/simplebar.min.css";
import MuiTheme from "theme/MuiTheme";
import NavLayout from "layouts/NavLayout";
// import GoogleAnalytics from "utils/GoogleAnalytics"; TODO
// import OpenGraphTags from "utils/OpenGraphTags"; TODO
// import "../src/fake-db"; TODO

type MyAppProps = AppProps & {
    Component: NextPage & {
        getLayout?: (page: ReactElement) => ReactNode;
    };
};

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done());
// small change
nProgress.configure({ showSpinner: false });

const App = ({ Component, pageProps }: MyAppProps) => {
    const getLayout = Component.getLayout ?? ((page) => page);

    useEffect(() => {
        AOS.init();
        AOS.refresh();

        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector("#jss-server-side");
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }
    }, []);

    return (
        <Fragment>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta charSet="utf-8" />
                {/* <GoogleAnalytics /> TODO */}
                {/* <OpenGraphTags /> TODO */}
            </Head>

            <SettingsProvider>
                <AppProvider>
                    <MuiTheme>
                        <NavLayout>
                            <Component {...pageProps}/>
                        </NavLayout>
                    </MuiTheme>
                </AppProvider>
            </SettingsProvider>
        </Fragment>
    );
};

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);

//   return { ...appProps };
// };

export default App;