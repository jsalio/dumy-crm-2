import { NextApiRequest, NextApiResponse } from "next";
import { firebase } from '../../../../utils/firebase-config';
import NextCors from "nextjs-cors";
import { DocumentTypeForConfiguration } from "../../../../models/documentType";
import { CardInfo } from "../active-process";

const db = firebase.database();
const jsTable = "card-info"

export type DocumentCard = {
    documentTypeId: number;
    process: number;
    handle: number;
    documentTypeName: string;
    client: string;
    type: 'Solicitante' | 'Other';
    isTemplate: boolean;
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

    console.log(req.body)

    const { id } = req.query;
    const ref = db.ref(`${jsTable}`);
    ref.once('value', (snapshot) => {
        snapshot.forEach((doc) => {
            const data = doc.val() as CardInfo;
            if (data.processId as any == id) {
                const dataSet = new Array<DocumentCard>();
                if ((data as any).configuration) {
                    ((data as any).configuration as Array<DocumentTypeForConfiguration>).forEach((element) => {
                        dataSet.push({
                            documentTypeId: element.id,
                            process: data.processId,
                            handle: data.handle === undefined ? 0 : data.handle,
                            documentTypeName: element.name,
                            client: (data as any).client,
                            type: 'Solicitante',
                            isTemplate: element.isTemplate

                        })
                    });
                }
                res.status(200).json(dataSet);
            }
        })
    })
}