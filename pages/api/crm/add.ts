import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import CrmDb from '../../../db/crm-data.json';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process-settings"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<CrmProcessConfig>
) {
    if (req.method !== 'POST') {
        res.status(404).json({
            message: 'Method not allowed'
        } as any);
    }
    const newProcess = req.body;
    const ref = db.ref(jsTable);
    const onPush = ref.push();
    onPush.set(newProcess);
    res.status(200).json(onPush.key as any)
}