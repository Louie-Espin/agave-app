import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { apiHandler } from "utils/api/apiHandler";
import { postUserSchema } from "utils/api/yup";
import createHttpError from "http-errors";
import { FirebaseError } from "firebase-admin";

type PostResponse = { uid: string; message: string; };
interface postUserRequest extends NextApiRequest {
    // use typeOf to infer the properties from postUserSchema
    body: { values : typeof postUserSchema };
}

const signUpHandler: NextApiHandler<PostResponse> = async (req: postUserRequest, res: NextApiResponse) => {

    // Initializing Firebase Admin SDK and validating request values
    initFirebaseAdminSDK();
    const validate = await postUserSchema.validate(req.body.values, { abortEarly: false, strict: true, });

    getAuth()
        .createUser({
            email: validate.email,
            emailVerified: false,
            password: validate.password,
            displayName: validate.displayName,
            disabled: false,
        })
        .then(async (userRecord) => {
            // eslint-disable-next-line no-console
            console.log('Successfully created new user:', userRecord.uid);

            const customToken = await getAuth().createCustomToken(userRecord.uid);
            return res.status(200).json({uid: customToken, message: 'createUser success!'});
        })
        .catch((e: unknown) => {

            // TODO: API resolved without sending a response for /api/sign-up, this may result in stalled requests.
            // if FirebaseError, return 400 response
            if ((e as FirebaseError).code) return res.status(400).json({ error: (e as FirebaseError).toJSON() });

            // eslint-disable-next-line no-console
            console.error(e);
            throw new createHttpError.InternalServerError((e as Error).message ?? "Unknown internal error occurred!");
        })
}

export default apiHandler({
    POST: signUpHandler,
});