import type { NextApiRequest, NextApiResponse } from 'next'
import { DocumentType } from '../../../models/documentType'
import { GetDocumentType } from '../../../utils/call-ProDoctivity-API'
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<DocumentType[]>
) {
  GetDocumentType('manager', 'password').then(data => {
    res.status(200).json(data)
  }) 
}
