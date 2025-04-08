interface TextractDataRelationship {
    Ids: string[];
    Type: string;
}

interface TextractDataGeometryBoundingBox {
    Height: number;
    Left: number;
    Top: number;
    Width: number;
}

interface TextractDataGeometry {
    BoundingBox: TextractDataGeometryBoundingBox;
}

interface TextractData {
    BlockType: string;
    Id: string;
    Relationships?: TextractDataRelationship[];
    Geometry: TextractDataGeometry;
    Confidence?: number;
    Text?: string;
}

interface FormData {
    userId: string;
    clientId: string;
}

interface ApiResponseAdd {
    success: boolean;
    message: string;
    invoiceId: number;
    lienClientFichier: string;
    formData: FormData;
    textractData: TextractData[];
}
