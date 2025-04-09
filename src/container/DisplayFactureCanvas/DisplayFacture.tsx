"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { submitBoundingBoxes } from "@/utils/canvas.action";
import { fetchInvoiceImage } from "@/utils/client-actions";
import { useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";
import CanvasDrawing from "./CanvasDrawing"; // Import du nouveau composant

// Typage pour BoundingBox
interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

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
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);

    // Charger l'image
    useEffect(() => {
        if (!pathFile) {
            setImageUrl(null);
            setError(null);
            setLoading(false);
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            setLoading(true);
            setError(null);

            const result = await fetchInvoiceImage(pathFile);
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

    const handleSubmit = async () => {
        const validBoxes = boundingBoxes.filter((box) => box.Width > 0 && box.Height > 0);
        if (validBoxes.length === 0) {
            setError("Aucune boîte valide à soumettre");
            return;
        }

        const result = await submitBoundingBoxes(validBoxes);
        if (result.success) {
            console.log("Bounding boxes soumises avec succès:", result.message);
        } else {
            setError(result.error);
        }
    };

    return (
        <div className="facture-display" style={{ userSelect: "none" }}>
            {loading && <p>Chargement de l'image...</p>}
            {error && <p className="error">Erreur : {error}</p>}
            {imageUrl && !loading && (
                <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={`Facture ${invoiceId || ""}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                        draggable={false}
                        onError={() => {
                            setError("Erreur lors du chargement de l'image");
                            setImageUrl(null);
                        }}
                    />
                    <CanvasDrawing
                        imageRef={imageRef}
                        boundingBoxes={boundingBoxes}
                        setBoundingBoxes={setBoundingBoxes}
                    />
                </div>
            )}
            {!pathFile && !loading && <p>Aucune facture sélectionnée</p>}
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Soumettre les boîtes
            </button>
        </div>
    );
}