import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, AxiosRequestConfig, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const getConfig = (url: string): AxiosRequestConfig => {
    return {
        url: url,
        method: 'GET',
        headers: {
            'Host': 'api.goformz.com',
            'Connection': 'keep-alive',
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, sdch',
            'Authorization': `Basic ${ENCODED}`,
        },
    }
};

const getTemplateForms: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    initAuth();
    initFirebaseAdminSDK();

    const id = req.query.id;
    const goFormzConfig = getConfig(`https://api.goformz.com/v2/templates/${id}/formz`);

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ forms: null, message: "GET template forms failed; No token!" });

    try {

        const getFormz = await axios(goFormzConfig);
        return res.status(200).json({ forms: getFormz.data, message: "GET template forms success." });

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
    GET: getTemplateForms,
});