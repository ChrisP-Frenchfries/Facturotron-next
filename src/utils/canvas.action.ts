"use server"


interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}


export async function submitBoundingBoxes(boundingBoxes: BoundingBox[]) {
    try {
        const response = await fetch("http://localhost:4242/api/facture/boxes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boxes: boundingBoxes }),
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}`);
        }

        const result = await response.json();
        return { success: true, message: result.message || "Bounding boxes enregistrées" };
    } catch (error: any) {
        console.error("Erreur dans submitBoundingBoxes:", error);
        return { success: false, error: error.message };
    }
}