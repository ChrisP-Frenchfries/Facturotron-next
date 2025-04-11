"use client"; // Nécessaire pour CanvasDrawing et useActionState

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { makeInvoiceElements } from "@/utils/canvas.action";
import { fetchInvoiceImage } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useEffect, useRef, useState, startTransition } from "react";
import { useActionState } from "react";
import CanvasDrawing from "./CanvasDrawing";
import { boundingBoxesAtom, formBoxsAtom } from "@/atom/canvas.atom";

export interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

export type FetchResult = {
    success: true;
    data: string;
} | {
    success: false;
    error: string;
};

export type SubmitResult = {
    success: boolean;
    message?: string;
    elements?: InvoiceElement[];
    error?: string;
} | null;


// Définition du type InvoiceElement
export interface InvoiceElement {
    id: string;
    nom: string;
    boundingBox: BoundingBox;
    blocks: any[]; // Vous pouvez définir un type plus précis si nécessaire
    confidence: number;
}

// Mise à jour du type SubmitResult


export default function DisplayFacture() {
    const [invoiceId] = useAtom(invoiceIdAtom); // Récupérer invoiceId depuis l'atome
    const [pathFile] = useAtom(pathFileAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [boundingBoxes, setBoundingBoxes] = useAtom(boundingBoxesAtom);// ici on a les boudingBoxs de base

    const imageRef = useRef<HTMLImageElement>(null);
    // Accès à l'atome pour le mettre à jour
    const [formBoxs, setformBoxs] = useAtom(formBoxsAtom);
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
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [pathFile]);

    // Utilisation de useActionState avec invoiceId inclus via closure
    const [submitState, submitAction, isPending] = useActionState<SubmitResult, BoundingBox[]>(
        async (_previousState: SubmitResult, validBoxes: BoundingBox[]) => {
            if (!invoiceId) {
                return { success: false, error: "ID de facture manquant" };
            }
            return await makeInvoiceElements(invoiceId, validBoxes); // Passer invoiceId et validBoxes
        },
        null
    );

    // Effet pour mettre à jour l'atome quand submitState change
    useEffect(() => {
        // Ne mettre à jour que si submitState existe et que l'action a réussi
        if (submitState?.success && Array.isArray(submitState.elements)) {
            setformBoxs([...submitState.elements, ...formBoxs]);
            setBoundingBoxes([]) // clear les boundingBox


        }
    }, [submitState, setformBoxs]); // Dépendances de l'effet


    const handleSubmit = () => {
        const validBoxes = boundingBoxes.filter((box) => box.Width > 0 && box.Height > 0);
        if (validBoxes.length === 0) {
            setImageError("Aucune boîte valide à soumettre");
            return;
        }
        startTransition(() => {
            submitAction(validBoxes); // Passer uniquement validBoxes, invoiceId est capturé par closure
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