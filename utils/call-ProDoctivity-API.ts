import { DocumentType } from "../models/documentType";
import * as RealmWeb from "realm-web"

export const GetDocumentType = (username: string, password: string): Promise<Array<DocumentType>> => {
    const site = 'http://18.218.98.135/Site'
    const nodeBtoa = (b: any) => Buffer.from(b).toString('base64');
    const userWithAgent = `${username}@prodoctivity`
    const auth = nodeBtoa(userWithAgent + ':' + password);
    return fetch(`${site}/api/v0.1/document-types`, {
        method: 'GET',
        headers: {
            contentType: 'application/json',
            authorization: `Basic ${auth}`,
            'x-api-key': 'd8092a8b-15a6-4f8e-87de-c582aa6445f9'
        }
    }).then(response => response.json());
}

