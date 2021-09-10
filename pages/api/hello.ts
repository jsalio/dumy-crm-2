// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import data from '../../db/data.json'
type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method === 'POST') {
    data.push({name:'Jorel'})
    res.status(200).json({ name: 'world' })
  }
  res.status(200).json({ name: 'John Doe' })
}
