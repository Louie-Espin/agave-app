import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getApp } from "firebase-admin/app"
import { initializeFirestore } from "firebase-admin/firestore";
import { verifyIdToken } from "next-firebase-auth";
import { PropertySchema } from "utils/api/yup";

const USERS_COL_: string = 'users';
const PROPERTIES_COL: string = 'properties';
const ADMIN_FIELD_: string = 'admin';
const PROPERTIES_FIELD = 'properties';

export const getUserProperties = async (token: string | null) => {

    if (!token) throw Error("SSR Function Error: no token!");

    const authUser = await verifyIdToken(token);
    if (!authUser.id) throw Error("SSR Function Error: User ID == NULL");

    let admin = false, properties: string[] = []

    // Initializing Firebase Admin SDK
    initAuth();
    initFirebaseAdminSDK();
    const db = initializeFirestore(getApp(), { preferRest: true });

    try {

        // Querying authenticated user in DB & checking for admin rights
        const authDoc = await db.collection(USERS_COL_).doc(authUser.id).get();

        if (authDoc.get(ADMIN_FIELD_)) return { admin: true, properties: [] }

        // Setting properties if PROPERTIES Field exists within doc
        properties = (!!authDoc.get(PROPERTIES_FIELD)) ? authDoc.get(PROPERTIES_FIELD) as string[] : [];

        return { admin, properties }

    } catch (e: any) {
        throw Error(!!(e?.message) ? e.message : "Unknown Error from SSR Function");
    }
}

export const getPropertyData = async (token: string | null, propertyId: string | null) => {

    if (!propertyId) throw Error("SSR Function Error: no propertyId!");
    if (!token) throw Error("SSR Function Error: no token!");

    const authUser = await verifyIdToken(token);
    if (!authUser.id) throw Error("SSR Function Error: User ID == NULL");

    let property = undefined;

    // Initializing Firebase Admin SDK
    initAuth();
    initFirebaseAdminSDK();
    const db = initializeFirestore(getApp(), { preferRest: true });

    try {

        // Querying property in DB
        const doc = await db.collection(PROPERTIES_COL).doc(propertyId).get();

        property = await PropertySchema.validate({...doc.data(), id: doc.id}, { abortEarly: false, strict: true, });

        return property;

    } catch (e: any) {
        throw Error(!!(e?.message) ? e.message : "Unknown Error from SSR Function");
    }
}