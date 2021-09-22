import { DocumentType } from "../models/documentType";
import * as RealmWeb from "realm-web"

export const GetDocumentType = (username: string, password: string): Promise<Array<DocumentType>> => {
    const site = 'http://localhost:47726'
    const nodeBtoa = (b: any) => Buffer.from(b).toString('base64');
    const userWithAgent = `${username}@prodoctivity`
    const auth = nodeBtoa(userWithAgent + ':' + password);
    return fetch(`${site}/api/v0.1/document-types`, {
        method: 'GET',
        headers: {
            contentType: 'application/json',
            authorization: `Basic ${auth}`,
            'x-api-key': 'a3001bd6-6b95-4e8b-84d7-8a03b9873a86'
        }
    }).then(response => response.json());
}

