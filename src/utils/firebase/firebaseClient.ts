import {initializeApp, getApps } from "@firebase/app";

export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    //storageBucket: process.env.STORAGE_BUCKET_FB_,
    //messagingSenderId: process.env.MESSAGING_SENDER_ID_FB_,
    //measurementId: process.env.MEASUREMENT_ID_FB_,
};

// Initialize Firebase
let firebaseClient = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export default firebaseClient;