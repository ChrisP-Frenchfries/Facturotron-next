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
    blocks: any[];
    confidence: number;
    inputValue?: string;
    selectedLabelField?: LabelField | null;
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
    return (
        blockBB.Top >= boundingBox.Top &&
        blockBottom <= bottom &&
        blockBB.Left >= boundingBox.Left &&
        blockRight <= right
    );
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
        console.log(`Fetched ${blocks.length} blocks for invoiceId ${invoiceId}`);

        // Création des éléments de facture
        const invoiceElements: InvoiceElement[] = boundingBoxes.map((box, index) => {
            // ID temporaire (sera remplacé par la DB lors de l'enregistrement)
            const id = nanoid();

            // Filtrer les blocs qui sont entièrement à l'intérieur de la bounding box
            const boxBlocks = blocks.filter((block) =>
                isBlockFullyInsideBoundingBox(block, box)
            );

            // Calculer la confiance minimale parmi tous les blocs
            const confidence = boxBlocks.reduce((minConf, block) => {
                if (block.Confidence !== undefined && block.Confidence < minConf) {
                    return block.Confidence;
                }
                return minConf;
            }, 100); // Commencer avec 100% pour gérer le cas où aucun bloc n'a de Confidence

            // Calculer l'inputValue en concatenant les Text des blocs
            const inputValue = boxBlocks
                .filter((block) => block.Text)
                .map((block) => block.Text)
                .join(" ")
                .trim();

            // Définir le selectedLabelField avec typeTextExtract: "Nouveau champ"
            const selectedLabelField: LabelField = {
                typeTextExtract: "Nouveau champ",
                label: `Champ ${index + 1}`, // Label par défaut
                couleurDefaut: "bg-red-500", // Bleu par défaut
                description: "Champ créé automatiquement",
                isAllowed: true, // Autorisé par défaut
            };

            // Créer l'élément de facture
            const element: InvoiceElement = {
                id,
                nom: selectedLabelField.label, // Utiliser le label comme nom
                boundingBox: box,
                blocks: boxBlocks,
                confidence,
                inputValue: inputValue || undefined, // Ne pas inclure si vide
                selectedLabelField,
            };

            console.log(`Created InvoiceElement:`, element);

            return element;
        });

        console.log(`Created ${invoiceElements.length} invoice elements`);

        // TODO: Enregistrer les éléments en base de données
        // const result = await saveInvoiceElements(invoiceId, invoiceElements);

        return {
            success: true,
            message: "Éléments de facture créés avec succès",
            elements: invoiceElements,
        };
    } catch (error: any) {
        console.error("Erreur dans makeInvoiceElements:", error);
        return {
            success: false,
            error: error.message,
        };
    }
}