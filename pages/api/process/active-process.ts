import { NextApiRequest, NextApiResponse } from "next";
import { firebase } from '../../../utils/firebase-config';
import NextCors from "nextjs-cors";

const db = firebase.database();
const jsTable = "card-info"

export type CardInfo = {
    processId: number
    processName: string,
    clientName: string,
    creatorName: string,
    creatorEmail: string,
    creatorPhone: string,
    creationDate: string,
    expiryDate: string,
    status: string,
    processDocumentRequirement: number,
    currentDocumentInProcess: number,
    handle?: number,
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<any>>
) {

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });
    const ref = db.ref(jsTable);
    ref.on("value", (snap) => {
        const dataset: Array<CardInfo> = [];
        snap.forEach((row) => {
            const data = row.val() as CardInfo;
            console.log(data);
            if (data.currentDocumentInProcess < data.processDocumentRequirement) {
                dataset.push(data as any);
            }

        })
        res.status(200).json(dataset);
    })
}