
//todo ici on va procéder a la création/modification  d'un invoice_elements

//todo l'invoice element a un id: clef en db (generation en DB, pas ici)

//todo un invoce id FK de invoices

//todo un field_type :
//? (faire un patern de class ? , c'est les champ comptable/pris en charge par l'ocr,
//?  potentiellement selectionnable depuis une liste dynamique)
//?  en fonction du field type il a un designe special
//?  possibilité d'ajouter des field type

//todo field_value: (defini ici par une formule pour recupe le contenu des blocks donc fetch de block de invocieId)

//todo evidement la boundingbox

//todo confidence : récupération du taux de confidence du block le moins fiable



// await call db pour recup les blocks par id (faire la route)

// recuperation de la facture via l'atome

//creation des elementBoxs



"use server";

import { LabelField } from "@/container/FormCanvasDynamique/LabelFieldSelector";
import { nanoid } from "nanoid";

export interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

export interface Block {
    BlockType: string;
    Confidence?: number;
    Text?: string;
    Geometry: {
        BoundingBox: BoundingBox;
    };
    Id: string;
    Relationships?: Array<{
        Ids: string[];
        Type: string;
    }>;
}

export interface InvoiceResponse {
    message: string;
    invoice: {
        Blocks: Block[];
    };
}

export interface InvoiceElement {
    id: string;
    nom: string;
    boundingBox: BoundingBox;
    blocks: Block[];
    confidence: number;
    inputValue?: string; // Ajout
    selectedLabelField?: LabelField | null; // Ajout
}
/**
 * Vérifie si un bloc est entièrement à l'intérieur d'une BoundingBox.
 */
function isBlockFullyInsideBoundingBox(block: Block, boundingBox: BoundingBox): boolean {
    const blockBB = block.Geometry.BoundingBox;

    // Calculer les limites de la BoundingBox
    const right = boundingBox.Left + boundingBox.Width;
    const bottom = boundingBox.Top + boundingBox.Height;

    // Calculer les limites du bloc
    const blockRight = blockBB.Left + blockBB.Width;
    const blockBottom = blockBB.Top + blockBB.Height;

    // Vérifier si le bloc est entièrement à l'intérieur des limites
    return blockBB.Top >= boundingBox.Top &&
        blockBottom <= bottom &&
        blockBB.Left >= boundingBox.Left &&
        blockRight <= right;
}

export async function makeInvoiceElements(
    invoiceId: number,
    boundingBoxes: BoundingBox[]
) {
    try {
        // Récupération des blocs depuis l'API
        const response = await fetch(`http://localhost:4242/api/facture/blocks?invoiceId=${invoiceId}`, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status} pour l'invoice ${invoiceId}`);
        }

        // Conversion de la réponse en JSON
        const data: InvoiceResponse = await response.json();
        const blocks = data.invoice.Blocks;

        // Création des éléments de facture
        const invoiceElements: InvoiceElement[] = boundingBoxes.map(box => {
            const id = nanoid();

            // Filtrer les blocs qui sont entièrement à l'intérieur de la bounding box
            const boxBlocks = blocks.filter(block => isBlockFullyInsideBoundingBox(block, box));

            // Calculer la confiance minimale parmi tous les blocs (si disponible)
            const confidence = boxBlocks.reduce((minConf, block) => {
                if (block.Confidence !== undefined && block.Confidence < minConf) {
                    return block.Confidence;
                }
                return minConf;
            }, 0); // Commencer avec 0% de confiance

            // Créer l'élément de facture
            return {
                id,
                nom: "", // À définir selon votre logique métier
                boundingBox: box,
                blocks: boxBlocks,
                confidence
            };
        });

        console.log(`Créé ${invoiceElements.length} éléments de facture`);

        // Ici, vous pourriez enregistrer les éléments en base de données
        // const result = await saveInvoiceElements(invoiceElements);

        return {
            success: true,
            message: "Éléments de facture créés avec succès",
            elements: invoiceElements
        };
    } catch (error: any) {
        console.error("Erreur dans makeInvoiceElements:", error);
        return {
            success: false,
            error: error.message
        };
    }
}