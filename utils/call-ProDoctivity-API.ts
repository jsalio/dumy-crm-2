import { DocumentType } from "../models/documentType";

export const GetDocumentType = (username:string, password:string): Promise<Array<DocumentType>> => {
    const nodeBtoa = (b:any) => Buffer.from(b).toString('base64');
    const userWithAgent = `${username}@prodoctivity`
    const auth = nodeBtoa(userWithAgent + ':' + password);
    return fetch(`http://192.168.43.1:8200/api/v0.1/document-types`, {
        method: 'GET',
        headers: {
            contentType: 'application/json',
            authorization: `Basic ${auth}`,
            'x-api-key': 'a3001bd6-6b95-4e8b-84d7-8a03b9873a86'
        }
    }).then(response => response.json());
}