"use server";

import { ApiResponseAdd } from "@/types/types.response";
import { revalidatePath } from "next/cache";

// Définir un type pour la réponse de la fonction
interface UploadResponse {
    message: string | null;
    invoiceId?: number; // Propriété optionnelle si elle n'est pas toujours présente
    filePath?: string; // Propriété optionnelle si elle n'est pas toujours présente
}

// Server Action pour envoyer le fichier et les paramètres à l'API
export async function uploadDocument(
    prevState: { message: string | null },
    formData: FormData
): Promise<UploadResponse> {
    try {
        const clientId = formData.get("clientId") as string;
        const userId = formData.get("userId") as string;
        const file = formData.get("document") as File;

        if (!clientId || !userId || !file) {
            return { message: "Tous les champs sont requis" };
        }

        const body = new FormData();
        body.append("clientId", clientId);
        body.append("userId", userId);
        body.append("document", file);

        const response = await fetch("http://localhost:4242/api/facture/", {
            method: "POST",
            body,
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const result: ApiResponseAdd = await response.json();
        revalidatePath("/upload");

        return {
            message: result.message || "Document envoyé avec succès !",
            invoiceId: result.invoiceId,
            filePath: result.lienClientFichier
        };
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        return { message: "Erreur lors de l'envoi du document" };
    }
}





export async function fetchInvoiceImage(filePath: string): Promise<{
    success: true;
    data: string;
} | {
    success: false;
    error: string;
}> {
    try {
        const apiUrl = `http://localhost:4242/api/facture/image/?pathFile=${encodeURIComponent(filePath)}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'image/webp'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('image/webp')) {
            throw new Error('Le serveur n\'a pas retourné une image WebP');
        }

        const imageData = await response.blob();
        return {
            success: true,
            data: URL.createObjectURL(imageData)
        };
    } catch (error: any) {
        console.error("Erreur dans fetchInvoiceImage:", error);
        return {
            success: false,
            error: error.message || 'Une erreur inconnue est survenue'
        };
    }
}