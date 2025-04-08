export interface TextractDataRelationship {
    Ids: string[];
    Type: string;
}



export interface TextractDataGeometryBoundingBox {
    Height: number;
    Left: number;
    Top: number;
    Width: number;
}

export interface TextractDataGeometry {
    BoundingBox: TextractDataGeometryBoundingBox;
}

export interface TextractData {
    BlockType: string;
    Id: string;
    Relationships?: TextractDataRelationship[];
    Geometry: TextractDataGeometry;
    Confidence?: number;
    Text?: string;
}

export interface FormData {
    userId: string;
    clientId: string;
}

export interface ApiResponseAdd {
    success: boolean;
    message: string;
    invoiceId: number;
    lienClientFichier: string;
    formData: FormData;
    textractData: TextractData[];
}
