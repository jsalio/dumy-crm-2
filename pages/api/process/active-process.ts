import { NextApiRequest, NextApiResponse } from "next";
import { CrmProcess } from "../../../models/Process";
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process"

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
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<any>>
) {

    let index = 0;
    const ref = db.ref(jsTable);
    ref.on("value", (snap) => {
        const dataset: Array<CardInfo> = [];
        snap.forEach((row) => {
            const data = row.val() as CrmProcess;
            dataset.push({
                processId: data.id,
                processName: data.name,
                clientName: 'Dummy client',
                creatorName: 'Dummy crm Client api',
                creatorEmail: 'dummy-crm-client@crmclient.com',
                creatorPhone: '+1-123-456-7890',
                creationDate: data.date,
                expiryDate: data.date,
                status: 'active',
                processDocumentRequirement: 0,
                currentDocumentInProcess: 0,
            });
            // dataset.push(row.val() as CardInfo)
            index++
            (dataset[index - 1] as any)._dbKey = row.key as any
        })
        res.status(200).json(dataset);
    })
}