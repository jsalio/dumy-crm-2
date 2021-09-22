import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcess } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<CrmProcess>
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