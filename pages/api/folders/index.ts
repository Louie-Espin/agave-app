import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import initAuth from "@firebaseUtils/initAuth";
import { verifyIdToken } from 'next-firebase-auth'
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { apiHandler } from "utils/api/apiHandler";
import { FolderSchema } from "utils/api/yup";
import { InferType } from "yup";
import { FirebaseError } from "firebase-admin";
import createHttpError from "http-errors";

type Folder = InferType<typeof FolderSchema>;
type GetResponse = { folders: any, message: string }
type PostResponse = { id: string | null, message: string }

const FOLDERS_COL_: string = 'folders';
const USERS_COL_: string = 'users';
const getFolders: NextApiHandler<GetResponse> = async (req: NextApiRequest, res: NextApiResponse ) => {
    initAuth();
    initFirebaseAdminSDK();
    const db = getFirestore();
    let folders: Folder[] = [];

    const token = req.headers['authorization'];
    if (!token) { return res.status(401).json({ folders: folders, message: "GET Folders failed; No token!" })}

    const authUser = await verifyIdToken(token);
    if (!authUser.id) { return res.status(401).json({ id: null, message: "GET Folders failed; Unauthorized!" })}

    try {
        const ownerRef = db.collection(USERS_COL_).doc(authUser.id);
        const query = db.collection(FOLDERS_COL_).where('owner', '==', ownerRef);
        const snapshot = await query.get();

        if (snapshot.empty) return res.status(200).json({ folders: folders, message: `GET Folders, no folders found for UID: ${authUser.id}`});

        for (const doc of snapshot.docs) {
            const validate = await FolderSchema.validate({ id: doc.id, ...doc.data() }, { abortEarly: false, strict: true, });

            folders.push(validate);
        }

        return res.status(200).json({ folders: folders, message: "GET Folders success." });
    } catch (e: unknown) {

        console.error(e);

        // if FirebaseError, return 400 response // FIXME not clean, doesnt have GetResponse props
        if (e instanceof Error) return res.status(400).json({ error: e });

        // eslint-disable-next-line no-console
        console.error(e);
        throw new createHttpError.InternalServerError((e as Error).message ?? "Unknown internal error occurred!");
    }
};

const postFolder: NextApiHandler<PostResponse> = async (req: NextApiRequest, res: NextApiResponse) => {
    initAuth();
    initFirebaseAdminSDK();
    const db = getFirestore();

    const token = req.headers['authorization'];
    if (!token) { return res.status(401).json({ id: null, message: "POST Folder failed; No token!" })}

    const authUser = await verifyIdToken(token);
    if (!authUser.id) { return res.status(401).json({ id: null, message: "POST Folder failed; Unauthorized!" })}

    const validate = await FolderSchema.validate(req.body.values, { abortEarly: false, strict: true, });

    try {

        db.collection(FOLDERS_COL_).add({
            name: validate.name,
            owner: db.collection(USERS_COL_).doc(authUser.id),
            //viewers: FieldValue.arrayUnion(validate.viewers.map((value) => { if (value) db.collection(USERS_COL_).doc(value) })),

        }).then((documentRef) => {
            return res.status(200).json({ id: documentRef.id, message: "POST Folder success." })
        }).catch((e: unknown) => {
            // if FirebaseError, return 400 response // FIXME not clean, doesnt have PostResponse props
            if ((e as FirebaseError).code) return res.status(400).json({ error: (e as FirebaseError).toJSON() });
        })
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(e);
        throw new createHttpError.InternalServerError((e as Error).message ?? "Unknown internal error occurred!");
    }
}

export default apiHandler({
    GET: getFolders,
    POST: postFolder,
})