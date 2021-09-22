import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcess } from '../../../models/Process';
import { firebase } from '../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "crm-process"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<CrmProcess>
) {
    const { id } = req.query;
    const ref = db.ref(`${jsTable}/${id}`);
    ref.on("value", (snap) => {
        res.status(200).json(snap.val());
    })
}