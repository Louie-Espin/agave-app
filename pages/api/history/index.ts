import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const config = (templateId: string) => {
    return {
        url: `https://api.goformz.com/v2/templates/${templateId}/formz`,
        method: 'GET',
        headers: {
            'Host': 'api.goformz.com',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Authorization': `Basic ${ENCODED}`,
        }
    }
};

const getForms: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    initAuth();
    initFirebaseAdminSDK();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ forms: null, message: "GET forms failed; No token!" });

    const { templateId } = req.query;
    if (!templateId) return res.status(400).json({ forms: null, message: "GET forms failed; No templateId!" });

    try {
        const getForms = await axios(config(templateId as string));
        return res.status(200).json({ forms: getForms.data, message: "GET forms success." });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ forms: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }
};

export default apiHandler({
    GET: getForms,
});