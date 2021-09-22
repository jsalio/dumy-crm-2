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
    if (req.method !== 'PUT') {
        res.status(404).json({
            message: 'Method not allowed'
        } as any);
    }
    const currentProcess = req.body;
    const process = CrmDb.find(p => p.id === currentProcess.id);
    if (!process) {
        res.status(404).json({
            message: 'Process not found'
        } as any);
    }
    const ref = db.ref(`${jsTable}/${currentProcess._dbKey}`)
    ref.update(currentProcess)
    res.status(200).json(ref.key as any);
}