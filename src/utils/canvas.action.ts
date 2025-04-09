"use server"




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



interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

interface Block {
    top: number;
    left: number;
    width: number;
    height: number;
}

/**
 * Vérifie si un bloc est entièrement à l'intérieur d'une BoundingBox.
 * @param block - Le bloc à vérifier avec les propriétés `top`, `left`, `width`, et `height`.
 * @param boundingBox - La BoundingBox avec les propriétés `Top`, `Left`, `Width`, et `Height`.
 * @returns {boolean} - Retourne true si le bloc est entièrement à l'intérieur de la BoundingBox, sinon false.
 */
function isBlockFullyInsideBoundingBox(block: Block, boundingBox: BoundingBox): boolean {
    const { top, left, width, height } = block;
    const { Top, Left, Width, Height } = boundingBox;

    // Calculer les limites de la BoundingBox
    const right = Left + Width;
    const bottom = Top + Height;

    // Calculer les limites du bloc
    const blockRight = left + width;
    const blockBottom = top + height;

    // Vérifier si le bloc est entièrement à l'intérieur des limites
    return top >= Top && blockBottom <= bottom && left >= Left && blockRight <= right;
}


export async function makeInvoiceElements(
    invoiceId: number,
    boundingBoxes: BoundingBox[]
) {


    //todo ici on va procéder a la création/modification  d'un invoice_elements

    //todo l'invoice element a un id: clef en db (generation en DB, pas ici)



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

    try {

        const blocksByInvoiceId = await fetch("http://localhost:4242/api/facture/id")
        const invoiceElements = []


        const elementBoundinBox =
            boundingBoxes.map(box => {
                invoiceId


            })






        const response = await fetch("http://localhost:4242/api/facture/boxes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boxes: boundingBoxes }),
        });

        if (!response.ok) {
            console.log(boundingBoxes)
            throw new Error(`Erreur HTTP ${invoiceId} ${response.status}`);
        }

        const result = await response.json();
        return { success: true, message: result.message || "Bounding boxes enregistrées" };
    } catch (error: any) {
        console.error("Erreur dans submitBoundingBoxes:", error);
        return { success: false, error: error.message };
    }
}