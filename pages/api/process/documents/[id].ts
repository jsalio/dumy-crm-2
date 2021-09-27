import { NextApiRequest, NextApiResponse } from "next";
import { firebase } from '../../../../utils/firebase-config';
import NextCors from "nextjs-cors";
import { DocumentTypeForConfiguration } from "../../../../models/documentType";

const db = firebase.database();
const jsTable = "card-info"

export type DocumentCard = {
    documentTypeId: number;
    process: number;
    handle: number;
    documentTypeName: string;
    client: string;
    type: 'Solicitante' | 'Other';
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<DocumentCard[]>
) {

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    });

    const { id } = req.query;
    const ref = db.ref(`${jsTable}/${id}`);
    ref.on("value", (snap) => {
        const data = snap.val();
        const dataSet = new Array<DocumentCard>();
        (data.configuration as Array<DocumentTypeForConfiguration>).forEach((element) => {
            dataSet.push({
                documentTypeId: element.id,
                process: data.processId,
                handle: 0,
                documentTypeName: element.name,
                client: data.client,
                type: 'Solicitante'

            })
        });
        res.status(200).json(dataSet);
    })
}