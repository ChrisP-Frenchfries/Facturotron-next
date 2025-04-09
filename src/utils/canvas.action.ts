"use server"


interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}


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






export async function makeInvoiceElements(boundingBoxes: BoundingBox[]) {
    // await call db pour recup les blocks par id (faire la route)



    //creation des elementBoxs

    try {

        const blocksId = []
        const invoiceElements = []

        boundingBoxes.map(box => {



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
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const result = await response.json();
        return { success: true, message: result.message || "Bounding boxes enregistrées" };
    } catch (error: any) {
        console.error("Erreur dans submitBoundingBoxes:", error);
        return { success: false, error: error.message };
    }
}