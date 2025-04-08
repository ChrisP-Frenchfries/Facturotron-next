"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { fetchInvoiceImage } from "@/utils/client-actions"; // Importez la version cliente
import { useAtom } from "jotai";
import { useEffect, useState } from "react";

type FetchResult = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
};

export default function DisplayFacture() {
    const [invoiceId] = useAtom(invoiceIdAtom);
    const [pathFile] = useAtom(pathFileAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log("pathFile dans DisplayFacture:", pathFile);

        if (!pathFile) {
            console.log("Aucun pathFile, réinitialisation");
            setImageUrl(null);
            setError(null);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            console.log("Début du fetch pour:", pathFile);
            setLoading(true);
            setError(null);

            const result = await fetchInvoiceImage(pathFile);
            console.log("Résultat du fetch:", result);

            if (isMounted) {
                if (result.success) {
                    setImageUrl(result.data);
                } else {
                    setError(result.error);
                    setImageUrl(null);
                }
                setLoading(false);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [pathFile]);

    return (
        <div className="facture-display">
            {loading && <p>Chargement de l'image...</p>}
            {error && <p className="error">Erreur : {error}</p>}
            {imageUrl && !loading && (
                <img
                    src={imageUrl}
                    alt={`Facture ${invoiceId || ''}`}
                    style={{ maxWidth: '100%', height: 'auto' }}
                    onError={() => {
                        setError("Erreur lors du chargement de l'image");
                        setImageUrl(null);
                    }}
                />
            )}
            {!pathFile && !loading && <p>Aucune facture sélectionnée</p>}
        </div>
    );
}