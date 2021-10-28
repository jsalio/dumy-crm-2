import type { NextApiRequest, NextApiResponse } from 'next'
import { CrmProcessConfig } from '../../../../models/Process';
import { firebase } from '../../../../utils/firebase-config';

const db = firebase.database();
const jsTable = "card-info"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { processId } = req.body;
    const { documentTypeId } = req.body;
    const { documentId } = req.body;

    const ref = db.ref(`${jsTable}`);
    ref.on("value", (snap) => {
        snap.forEach((child) => {
            if (child.val().processId === processId) {
                const childRef = db.ref(`${jsTable}/${child.key}`);
                childRef.get().then((snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        (data.configuration as any[]).forEach((element) => {
                            if ((Number.parseInt(element.id) === Number.parseInt(documentTypeId))) {
                                element.handle = documentId;
                            }
                        });
                        data.currentDocumentInProcess = (data.configuration as any[]).filter(x => x.handle !== undefined).length;
                        childRef.set(data);
                    }
                })
                res.status(200).json(child.val());
            }
        })
    })
}