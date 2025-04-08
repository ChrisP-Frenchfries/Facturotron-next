"use server";

import { ApiResponseAdd } from "@/types/types.response";
import { revalidatePath } from "next/cache";



// Server Action pour envoyer le fichier et les paramètres à l'API
export async function uploadDocument(
    prevState: { message: string | null },
    formData: FormData
): Promise<{ message: string | null }> {
    try {
        const clientId = formData.get("clientId") as string;
        const userId = formData.get("userId") as string;
        const file = formData.get("document") as File;

        // Validation basique
        if (!clientId || !userId || !file) {
            return { message: "Tous les champs sont requis" };
        }

        // Préparer le body pour l'API
        const body = new FormData();
        body.append("clientId", clientId);
        body.append("userId", userId);
        body.append("document", file);

        // Appel à l'API
        const response = await fetch("http://localhost:4242/api/facture/", {
            method: "POST",
            body,
            headers: {
                // Pas de Content-Type ici, fetch gère automatiquement multipart/form-data
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const result: ApiResponseAdd = await response.json();

        // Revalider la page si nécessaire
        revalidatePath("/upload");

        return { message: result.message || "Document envoyé avec succès !" };
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        return { message: "Erreur lors de l'envoi du document" };
    }
}
