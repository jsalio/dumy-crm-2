import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import CrmDb from '../../../db/crm-data.json';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<CrmProcessConfig>>
) {
    res.status(200).json(CrmDb as any)
}
