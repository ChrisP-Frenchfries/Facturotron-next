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