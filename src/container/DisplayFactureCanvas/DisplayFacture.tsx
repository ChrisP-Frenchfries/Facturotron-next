"use client"; // Nécessaire pour CanvasDrawing et useActionState

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { makeInvoiceElements } from "@/utils/canvas.action";
// Importer depuis le fichier serveur
import { useAtom } from "jotai";
import { useEffect, useRef, useState, startTransition } from "react";
import { useActionState } from "react";
import CanvasDrawing from "./CanvasDrawing";
import { fetchInvoiceImage } from "@/utils/facture.action";

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

type SubmitResult = {
    success: boolean;
    message?: string;
    error?: string;
} | null;

export default function DisplayFacture() {
    const [invoiceId] = useAtom(invoiceIdAtom);
    const [pathFile] = useAtom(pathFileAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [boundingBoxes, setBoundingBoxes] = useState<BoundingBox[]>([]);
    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!pathFile) {
            setImageUrl(null);
            setImageError(null);
            setImageLoading(false);
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            setImageLoading(true);
            setImageError(null);

            const result = await fetchInvoiceImage(pathFile); // Appelle la Server Action
            if (isMounted) {
                if (result.success) {
                    setImageUrl(result.data); // Base64 data URL
                } else {
                    setImageError(result.error);
                    setImageUrl(null);
                }
                setImageLoading(false);
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl); // Toujours valide si vous revenez à URL.createObjectURL côté client
            }
        };
    }, [pathFile]);

    const [submitState, submitAction, isPending] = useActionState<SubmitResult, BoundingBox[]>(
        async (_previousState: SubmitResult, validBoxes: BoundingBox[]) => {
            return await makeInvoiceElements(validBoxes);
        },
        null
    );

    const handleSubmit = () => {
        const validBoxes = boundingBoxes.filter((box) => box.Width > 0 && box.Height > 0);
        if (validBoxes.length === 0) {
            setImageError("Aucune boîte valide à soumettre");
            return;
        }
        startTransition(() => {
            submitAction(validBoxes);
        });
    };

    return (
        <div className="facture-display" style={{ userSelect: "none" }}>
            {imageLoading && <p>Chargement de l'image...</p>}
            {imageError && <p className="error">Erreur : {imageError}</p>}
            {imageUrl && !imageLoading && (
                <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={`Facture ${invoiceId || ""}`}
                        style={{ maxWidth: "100%", height: "auto" }}
                        draggable={false}
                        onError={() => {
                            setImageError("Erreur lors du chargement de l'image");
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
            {!pathFile && !imageLoading && <p>Aucune facture sélectionnée</p>}
            {submitState && !submitState.success && <p className="error">Erreur : {submitState.error}</p>}
            {submitState && submitState.success && <p className="success">Succès : {submitState.message}</p>}
            <button
                onClick={handleSubmit}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={isPending}
            >
                {isPending ? "Soumission en cours..." : "Soumettre les boîtes"}
            </button>
        </div>
    );
}