import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcess } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<CrmProcess>
) {
    if (req.method !== 'PUT') {
        res.status(404).json({
            message: 'Method not allowed'
        } as any);
    }
    const currentProcess = req.body;
    const ref = db.ref(`${jsTable}/${currentProcess._dbKey}`)
    ref.update(currentProcess)
    res.status(200).json(ref.key as any);
}