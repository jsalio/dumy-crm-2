import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import CrmDb from '../../../db/crm-data.json';

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
    for (let key= 0 ; key <= CrmDb.length-1; key++) {
        if (CrmDb[key].id === currentProcess.id) {
            CrmDb[key] = currentProcess;
        }
    }
    res.status(200).json(currentProcess);
}