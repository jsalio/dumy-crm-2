import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process-settings"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Array<CrmProcessConfig>>
) {
  let index = 0;
  const ref = db.ref(jsTable);
  ref.on("value", (snap) => {
    const dataset: Array<CrmProcessConfig> = [];
    snap.forEach((row) => {
      dataset.push(row.val() as CrmProcessConfig)
      index++
      dataset[index - 1]._dbKey = row.key as any
    })
    res.status(200).json(dataset);
  })
}
