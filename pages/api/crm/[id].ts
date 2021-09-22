import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process-settings"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<CrmProcessConfig>
) {
  const { id } = req.query;
  const ref = db.ref(`${jsTable}/${id}`);
  ref.on("value", (snap) => {
    res.status(200).json(snap.val());
  })
}