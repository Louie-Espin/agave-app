import { init } from 'next-firebase-auth';
import type { InitConfig } from "next-firebase-auth";

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000

const initConfig: InitConfig = {
    debug: true,
    authPageURL: '/log-in',
    appPageURL: '/',
    loginAPIEndpoint: '/api/log-in',
    logoutAPIEndpoint: '/api/log-out',
    onLoginRequestError: (err: unknown) => { console.error(err) },
    onLogoutRequestError: (err: unknown) => { console.error(err) },
    firebaseAdminInitConfig: {
        credential: {
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID as string,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL as string,
            // Private ket must not be accessible client-side
            // Using JSON to handle newline problems when storing the key as a secret in Vercel. See:
            // https://github.com/vercel/vercel/issues/749#issuecomment-707515089
            privateKey: process.env.FIREBASE_PRIVATE_KEY as string,
        },
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL as string,
    },
    firebaseClientInitConfig: {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY as string, // required
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
        name: 'AgaveAuth', // required
        // Keys are required unless you set `signed` to `false`.
        // The keys cannot be accessible on the client side.
        keys: [
            process.env.COOKIE_SECRET_CURRENT,
            process.env.COOKIE_SECRET_PREVIOUS,
        ],
        httpOnly: true,
        maxAge: TWELVE_DAYS_IN_MS,
        overwrite: true,
        path: '/',
        sameSite: 'Strict',
        secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === 'true', // set this to false in local (non-HTTPS) development
        signed: true,
    },
    onVerifyTokenError: (err: unknown) => { console.error(err) },
    onTokenRefreshError: (err: unknown) => { console.error(err) },
}

const initAuth = () => { init(initConfig) }

export default initAuth