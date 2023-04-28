import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import { getAuth } from "firebase-admin/auth";
import { apiHandler } from "utils/api/apiHandler";
import { postUserSchema } from "utils/api/yup";
import createHttpError from "http-errors";

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
            // eslint-disable-next-line no-console
            console.error(e);

            let message = 'Unknown internal error occurred!';
            if (e instanceof Error) message = e.message;

            throw new createHttpError.InternalServerError(message);
        })
}

export default apiHandler({
    POST: signUpHandler,
});