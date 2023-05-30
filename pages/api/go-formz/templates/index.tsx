import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import axios, {AxiosError, isAxiosError} from "axios";
import { apiHandler } from "utils/api/apiHandler";
import initAuth from "@firebaseUtils/initAuth";
import initFirebaseAdminSDK from "@firebaseUtils/firebaseAdmin";
import createHttpError from "http-errors";

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

const categoriesDefault = [
    {
        "id": "a3acdd99-2cff-4475-a69f-b4758527b74e",
        "name": "Absent Form",
        "url": "https://api.goformz.com/v2/templates/a3acdd99-2cff-4475-a69f-b4758527b74e"
    },
    {
        "id": "6506f1c1-3190-42d1-83e7-8b669af4f8ca",
        "name": "Agave Material Request Form ",
        "url": "https://api.goformz.com/v2/templates/6506f1c1-3190-42d1-83e7-8b669af4f8ca"
    },
    {
        "id": "dae74f05-da7a-47dd-9d75-fb8721d375ce",
        "name": "Arrowhead Ranch Report ",
        "url": "https://api.goformz.com/v2/templates/dae74f05-da7a-47dd-9d75-fb8721d375ce"
    },
    {
        "id": "54da8955-5d9c-418f-ac1a-36f79f882c00",
        "name": "EE STATUS CHANGE Rev 04.2022",
        "url": "https://api.goformz.com/v2/templates/54da8955-5d9c-418f-ac1a-36f79f882c00"
    },
    {
        "id": "f591fd96-5d9e-4aa1-9f6e-60ea8ac3dabf",
        "name": "Equipment Repair Request",
        "url": "https://api.goformz.com/v2/templates/f591fd96-5d9e-4aa1-9f6e-60ea8ac3dabf"
    },
    {
        "id": "9fc58c78-b760-46f0-bf36-e9c45dfd219d",
        "name": "Expense  Log Goformz",
        "url": "https://api.goformz.com/v2/templates/9fc58c78-b760-46f0-bf36-e9c45dfd219d"
    },
    {
        "id": "0f2bde1b-7250-45f8-b890-39de4c025ae3",
        "name": "Expense Report - Starter",
        "url": "https://api.goformz.com/v2/templates/0f2bde1b-7250-45f8-b890-39de4c025ae3"
    },
    {
        "id": "b2ed8d2d-cd33-423d-a4b6-8c6d60eded29",
        "name": "Invoice - Starter",
        "url": "https://api.goformz.com/v2/templates/b2ed8d2d-cd33-423d-a4b6-8c6d60eded29"
    },
    {
        "id": "48f5ff99-49db-416a-9557-1bd1639a34b9",
        "name": "Irrigation timesheet 2023",
        "url": "https://api.goformz.com/v2/templates/48f5ff99-49db-416a-9557-1bd1639a34b9"
    },
    {
        "id": "b3992441-fc10-4718-b1a2-ebb6a5d6f893",
        "name": "Jobsite Inspection - Starter",
        "url": "https://api.goformz.com/v2/templates/b3992441-fc10-4718-b1a2-ebb6a5d6f893"
    },
    {
        "id": "d131b34f-7bda-482e-8c66-4d39d2005387",
        "name": "Maintenance Punch List",
        "url": "https://api.goformz.com/v2/templates/d131b34f-7bda-482e-8c66-4d39d2005387"
    },
    {
        "id": "cda1338e-d502-44fd-9940-e06d366df3b6",
        "name": "Project Proposal - Starter",
        "url": "https://api.goformz.com/v2/templates/cda1338e-d502-44fd-9940-e06d366df3b6"
    },
    {
        "id": "04e21b49-f139-4192-b27b-74cc256f9237",
        "name": "Proposal Request Form 2.0",
        "url": "https://api.goformz.com/v2/templates/04e21b49-f139-4192-b27b-74cc256f9237"
    },
    {
        "id": "9f632733-cb3c-410f-94d3-ef10edefa502",
        "name": "Release Form - Starter",
        "url": "https://api.goformz.com/v2/templates/9f632733-cb3c-410f-94d3-ef10edefa502"
    },
    {
        "id": "dc73125a-21a0-41d6-bf60-0466a3df9012",
        "name": "Report template V.4",
        "url": "https://api.goformz.com/v2/templates/dc73125a-21a0-41d6-bf60-0466a3df9012"
    },
    {
        "id": "f9b58d1a-0101-400c-ab2c-f4f2b1532bb2",
        "name": "Report template V.6 - GoFormz",
        "url": "https://api.goformz.com/v2/templates/f9b58d1a-0101-400c-ab2c-f4f2b1532bb2"
    },
    {
        "id": "faad25ce-2f28-4d96-85fc-ac9dcbbb3c15",
        "name": "Request For Time Off Form - Starter",
        "url": "https://api.goformz.com/v2/templates/faad25ce-2f28-4d96-85fc-ac9dcbbb3c15"
    },
    {
        "id": "47e4fd87-a952-4270-8ff3-80550ab56ac0",
        "name": "Sample Work Order",
        "url": "https://api.goformz.com/v2/templates/47e4fd87-a952-4270-8ff3-80550ab56ac0"
    },
    {
        "id": "6efc08b0-8942-42f0-a7d0-2c19981e1684",
        "name": "Service Report Template - 2.0",
        "url": "https://api.goformz.com/v2/templates/6efc08b0-8942-42f0-a7d0-2c19981e1684"
    },
    {
        "id": "73a69bb6-c6ca-4925-856d-74cdfea67664",
        "name": "Templates Quick Start Guide",
        "url": "https://api.goformz.com/v2/templates/73a69bb6-c6ca-4925-856d-74cdfea67664"
    },
    {
        "id": "55534c70-6916-4faf-a2db-de238b8684ee",
        "name": "Time Sheet Maintenance 2023 *",
        "url": "https://api.goformz.com/v2/templates/55534c70-6916-4faf-a2db-de238b8684ee"
    },
    {
        "id": "34f626a6-ee94-4109-b23b-5408b4fa1477",
        "name": "Timesheet - Starter",
        "url": "https://api.goformz.com/v2/templates/34f626a6-ee94-4109-b23b-5408b4fa1477"
    },
    {
        "id": "ee739493-2d77-4994-829d-c2a788d2c3ac",
        "name": "timesheet 2.1",
        "url": "https://api.goformz.com/v2/templates/ee739493-2d77-4994-829d-c2a788d2c3ac"
    },
    {
        "id": "2d9739bb-3d40-4914-b06f-1aad7110d9d1",
        "name": "Truck inventory 2023",
        "url": "https://api.goformz.com/v2/templates/2d9739bb-3d40-4914-b06f-1aad7110d9d1"
    },
    {
        "id": "45f773b8-c786-4e44-8edc-45e09cc2066b",
        "name": "Visitor Sign-In Sheet - Starter",
        "url": "https://api.goformz.com/v2/templates/45f773b8-c786-4e44-8edc-45e09cc2066b"
    }
];

const getTemplates: NextApiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
    initAuth();
    initFirebaseAdminSDK();

    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ categories: null, message: "GET form categories failed; No token!" });

    try {

        const getCategories = await axios(config);
        return res.status(200).json({ categories: getCategories.data, message: "GET Categories success." });

    } catch (err: any | AxiosError) {

        if (isAxiosError(err)) {
            console.log(err);
            return res.status(400).json({ categories: null, message: "Couldn't connect to Go Formz!" });
        }

        // eslint-disable-next-line no-console
        console.error(err);
        throw new createHttpError.InternalServerError((err as Error).message ?? "Unknown internal error occurred!");
    }

};

export default apiHandler({
    GET: getTemplates,
});