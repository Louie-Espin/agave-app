// Import the functions you need from the SDKs you need

import firebase from "firebase/app";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "@firebase/storage";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "@firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: process.env._API_KEY_FB,
    authDomain: process.env._AUTH_DOMAIN_FB,
    projectId: process.env._PROJECT_ID_FB,
    storageBucket: process.env._STORAGE_BUCKET_FB,
    messagingSenderId: process.env._MESSAGING_SENDER_ID_FB,
    appId: process.env._APP_ID_FB,
    measurementId: process.env._MEASUREMENT_ID_FB,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth()
export const firestore = getFirestore();
export const storage = getStorage();