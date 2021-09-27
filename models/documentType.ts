export interface Volume {
    id: number;
    description: string;
    path: string;
    maxFilesCount: number;
    maxFolderZise: number;
    isDefault: boolean;
}

export interface BusinessLine {
    id: number;
    description: string;
    defaultWorkflowConfigurationId: number;
    status: string;
    comments: string;
    type: string;
}

export interface Icon {
    id: string;
    description: string;
}

export interface DocumentType {
    id: number;
    name: string;
    volume: Volume;
    status: string;
    businessLine: BusinessLine;
    format: string;
    useFullTextIndex: boolean;
    icon: Icon;
    isTemplate: boolean;
}

export type DocumentTypeForConfiguration = {
    id: number,
    name: string,
    isTemplate: boolean,
    status: "active" | "Inactive",
    isRequired: boolean,
}