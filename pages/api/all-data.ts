// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { GetDocumentType } from '../../utils/call-ProDoctivity-API'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<Data>>
) {
  GetDocumentType('manager', 'password').then(data => {
    res.status(200).json(data)
  })
  // res.status(200).json(data)
}
