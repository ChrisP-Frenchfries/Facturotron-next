"use server";

import { ApiResponseAdd } from "@/types/types.response";
import { revalidatePath } from "next/cache";
import { InvoiceElement } from "./canvas.action";

// Définir un type pour la réponse de la fonction
interface UploadResponse {
    message: string | null;
    invoiceId?: number; // Propriété optionnelle si elle n'est pas toujours présente
    filePath?: string; // Propriété optionnelle si elle n'est pas toujours présente
}




// Interface pour la structure des données retournées par l'API
interface ApiResponse {
    success: boolean;
    message: string;
    data: Array<{
        invoiceId: number;
        [key: string]: string | number;
    }>;
    error?: string | null;
}

// Interface pour l'état géré par useActionState
interface ActionState {
    success: boolean;
    message: string;
    data: Array<{
        invoiceId: number;
        [key: string]: string | number;
    }>;
    error: string | null;
}

// Fonction pour effectuer la requête fetch (peut être réutilisée)
async function fetchReadyForPrint(firmAccountingId: string | number, userId: string | number | null = null): Promise<ApiResponse> {
    try {
        let url = `http://localhost:4242/api/facture/ready/?firmAccountingId=${firmAccountingId}`;
        if (userId) {
            url += `&userId=${userId}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Ajoutez un token si nécessaire
                // 'Authorization': `Bearer ${yourToken}`
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error: unknown) {
        // Typage explicite de error comme unknown, puis conversion en Error
        if (error instanceof Error) {
            throw new Error(`Erreur lors de la récupération des factures: ${error.message}`);
        }
        throw new Error(`Erreur lors de la récupération des factures: ${String(error)}`);
    }
}








export async function uploadDocument(
    prevState: { message: string | null },
    formData: FormData
): Promise<UploadResponse> {
    try {
        const clientId = formData.get("clientId") as string;
        const userId = formData.get("userId") as string;
        const file = formData.get("document") as File;
        const isSmartDetect = formData.get("isSmartDetect") as string;

        // Validation des champs requis
        if (!clientId || !userId || !file) {
            return { message: "Tous les champs (clientId, userId, document) sont requis" };
        }

        // Créer le corps de la requête
        const body = new FormData();
        body.append("clientId", clientId);
        body.append("userId", userId);
        body.append("document", file);
        body.append("isSmartDetect", isSmartDetect || "false"); // Par défaut false si non fourni

        // Envoyer la requête à l'API
        const response = await fetch("http://localhost:4242/api/facture/", {
            method: "POST",
            body,
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const result: ApiResponseAdd = await response.json();

        return {
            message: result.message || "Document envoyé avec succès !",
            invoiceId: result.invoiceId,
            filePath: result.lienClientFichier,
        };
    } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        return { message: `Erreur lors de l'envoi du document: ${error.message}` };
    }
}




export async function fetchInvoiceImage(filePath: string): Promise<{
    success: true;
    data: string; // Base64
} | {
    success: false;
    error: string;
}> {
    try {
        // const session = await getServerSession(authOptions);
        // if (!session || !session.user) {
        //     throw new Error("Utilisateur non authentifié");
        // }

        // const jwtToken = session.accessToken; // Récupérer le JWT
        const apiUrl = `http://localhost:4242/api/facture/image/?pathFile=${encodeURIComponent(filePath)}`;
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Accept": "image/webp",
                // "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("image/webp")) {
            throw new Error("Le serveur n'a pas retourné une image WebP");
        }

        const imageData = await response.arrayBuffer(); // Récupérer les données brutes
        const base64Image = Buffer.from(imageData).toString("base64");
        const dataUrl = `data:image/webp;base64,${base64Image}`;

        return {
            success: true,
            data: dataUrl,
        };
    } catch (error: any) {
        console.error("Erreur dans fetchInvoiceImage:", error);
        return {
            success: false,
            error: error.message || "Une erreur inconnue est survenue",
        };
    }
}






export async function formAddInvoiceElement(
    prevState: { message: string | null },
    formData: FormData
): Promise<{ message: string | null }> {
    try {

        console.log(formData)
        const invoiceId = formData.get("invoiceId")?.toString();
        const formBoxsRaw = formData.get("formBoxs")?.toString();

        if (!invoiceId || !formBoxsRaw) {
            return { message: "Missing required fields" };
        }

        const formBoxs: InvoiceElement[] = JSON.parse(formBoxsRaw);

        const response = await fetch(`http://localhost:4242/api/facture/${invoiceId}/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formBoxs),
        });

        if (!response.ok) {
            throw new Error("Failed to submit invoice elements");
        }

        return { message: "Invoice elements submitted successfully" };
    } catch (error) {
        console.error("Error submitting invoice elements:", error);
        return { message: "Error submitting invoice elements" };
    }
}




// Action serveur pour React 19
export async function getReadyForPrintAction(prevState: ActionState, formData: FormData): Promise<ActionState> {
    // Récupérer les valeurs et les convertir en string ou number
    const firmAccountingIdRaw = formData.get('firmAccountingId');
    const userIdRaw = formData.get('userId');

    // Convertir firmAccountingId en string ou number (on s'attend à un nombre)
    const firmAccountingId = firmAccountingIdRaw ? String(firmAccountingIdRaw) : null;
    // Convertir userId en string ou number, ou null si vide
    const userId = userIdRaw ? String(userIdRaw) : null;

    try {
        if (!firmAccountingId) {
            return {
                success: false,
                error: 'Le paramètre firmAccountingId est requis',
                data: [],
                message: '',
            };
        }

        const result = await fetchReadyForPrint(firmAccountingId, userId);
        return {
            success: result.success,
            message: result.message,
            data: result.data,
            error: null,
        };
    } catch (error: unknown) {
        // Typage explicite de error comme unknown, puis conversion
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
                data: [],
                message: '',
            };
        }
        return {
            success: false,
            error: String(error),
            data: [],
            message: '',
        };
    }
}




export async function generateCsvFromReadyForPrint(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const firmAccountingIdRaw = formData.get('firmAccountingId');
    const userIdRaw = formData.get('userId');

    const firmAccountingId = firmAccountingIdRaw ? String(firmAccountingIdRaw) : null;
    const userId = userIdRaw ? String(userIdRaw) : null;

    try {
        if (!firmAccountingId) {
            return {
                success: false,
                error: 'Le paramètre firmAccountingId est requis',
                data: [],
                message: '',
            };
        }

        if (!userId) {
            return {
                success: false,
                error: 'Le paramètre userId est requis pour la validation des factures',
                data: [],
                message: '',
            };
        }

        const result = await fetchReadyForPrint(firmAccountingId, userId);

        if (!result.success || !result.data) {
            return {
                success: false,
                error: 'Aucune donnée disponible pour générer le CSV',
                data: [],
                message: '',
            };
        }

        const formattedData = result.data.map((item: any) => ({
            invoiceId: item.id || item.invoiceId,
            ...item,
        }));

        const uniqueKeys = Array.from(
            new Set(
                formattedData.flatMap((row: any) =>
                    Object.keys(row).filter((key) => key !== 'invoiceId')
                )
            )
        );

        const headers = ['invoiceId', ...uniqueKeys];
        const csvRows = [
            headers.join(','),
            ...formattedData.map((row: any) =>
                headers
                    .map((key) => {
                        const value = row[key] ?? '';
                        return `"${String(value).replace(/"/g, '""')}"`;
                    })
                    .join(',')
            ),
        ];

        // Ajouter le BOM pour UTF-8
        const BOM = '\uFEFF';
        const csvContent = BOM + csvRows.join('\n');

        // Générer le base64 avec le BOM inclus
        const base64Csv = Buffer.from(csvContent).toString('base64');

        // Extraire les invoiceIds pour la validation
        const invoiceIds = formattedData
            .map((item: any) => item.invoiceId)
            .filter((id: any) => typeof id === 'number' && id > 0);

        // Valider les factures via l'API
        if (invoiceIds.length > 0) {
            const validationResponse = await fetch('http://localhost:4242/api/facture/ready', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    invoiceIds,
                    userId: parseInt(userId, 10),
                }),
            });

            const validationResult = await validationResponse.json();

            if (!validationResult.success) {
                return {
                    success: true, // Le CSV est généré, donc on ne bloque pas le téléchargement
                    message: `data:text/csv;base64,${base64Csv}`,
                    data: [],
                    error: `CSV généré, mais erreur lors de la validation des factures : ${validationResult.error}`,
                };
            }
        }

        return {
            success: true,
            message: `data:text/csv;base64,${base64Csv}`,
            data: [],
            error: null,
        };
    } catch (error: unknown) {
        if (error instanceof Error) {
            return {
                success: false,
                error: error.message,
                data: [],
                message: '',
            };
        }
        return {
            success: false,
            error: String(error),
            data: [],
            message: '',
        };
    }
}






export type FetchElementsResponse = {
    success: boolean;
    data?: InvoiceElement[];
    error?: string;
};

export async function fetchInvoiceElements(invoiceId: number): Promise<FetchElementsResponse> {
    try {
        if (!invoiceId || invoiceId <= 0) {
            return { success: false, error: "invoiceId invalide" };
        }

        const response = await fetch(`http://localhost:4242/api/facture/elements?invoiceId=${invoiceId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`Erreur API: ${response.status}`);
        }

        const result = await response.json();

        return {
            success: true,
            data: result.invoice.Elements,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des invoiceElements:", error);
        return {
            success: false,
            error: `Erreur lors de la récupération des éléments: ${error.message}`,
        };
    }
}