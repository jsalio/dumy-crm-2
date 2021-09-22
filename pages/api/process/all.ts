import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcess } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Array<CrmProcess>>
) {
    let index = 0;
    const ref = db.ref(jsTable);
    ref.on("value", (snap) => {
        const dataset: Array<CrmProcess> = [];
        snap.forEach((row) => {
            dataset.push(row.val() as CrmProcess)
            index++
            (dataset[index - 1] as any)._dbKey = row.key as any
        })
        res.status(200).json(dataset);
    })
}