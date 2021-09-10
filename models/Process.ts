import { DocumentTypeForConfiguration } from "./documentType"

export type CrmProcessConfig = {
    id:any,
    name:string,
    date:string,
    status:boolean,
    configuration:CrmProcesses,
}

export type CrmProcesses = {
    documentTypes: Array<DocumentTypeForConfiguration>,
    expireDateInDays:number,
}


export type CrmProcess = {
    id : any,
    name : string,
    date : string,
    configuration : CrmProcessConfig,
}