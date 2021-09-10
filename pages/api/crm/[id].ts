import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import CrmDb from '../../../db/crm-data.json';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CrmProcessConfig>
) {
    const {id} = req.query;
    const target = (CrmDb as CrmProcessConfig[]).find(p => p.id === Number.parseInt(id as string));
    res.status(200).json(target as any);
}