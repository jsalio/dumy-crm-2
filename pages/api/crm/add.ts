import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import CrmDb from '../../../db/crm-data.json';

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
    CrmDb.push(newProcess);
    res.status(200).json(newProcess);
}