import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";

const GET_URL: string = "https://api.goformz.com/v2/templates";

const ENCODED: string = Buffer.from(`${process.env.GOFORMZ_LOGIN}:${process.env.GOFORMZ_PASS}`).toString('base64');

const config = {
    url: GET_URL,
    method: 'GET',
    headers: {
        'Host': 'api.goformz.com',
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Authorization': `Basic ${ENCODED}`,
    },
};

const getTemplates: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    initAuth();
    initFirebaseAdminSDK();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ categories: null, message: "GET form categories failed; No token!" });

    const getCategories = await axios(config);

    return res.status(200).json({ categories: getCategories.data, message: "GET Categories success." });
};

export default apiHandler({
    GET: getTemplates,
});