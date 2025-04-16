"use client"; // Nécessaire pour CanvasDrawing et useActionState

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { InvoiceElement, makeInvoiceElements } from "@/utils/canvas.action";
import { fetchInvoiceImage, fetchInvoiceElements } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useEffect, useRef, useState, startTransition } from "react";
import { useActionState } from "react";
import CanvasDrawing from "./CanvasDrawing";
import { activeCanvasDrawingAtom, activeInputValueAtom, boundingBoxesAtom, formBoxsAtom } from "@/atom/canvas.atom";
import BoundingBoxEditor from "./BoundingBoxEditor";
import BoundingBoxOverlay from "./BoundingBoxOverLay/BoundingBoxOverlay";

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

export default function DisplayFacture() {
    const [invoiceId] = useAtom(invoiceIdAtom); // Récupérer invoiceId depuis l'atome
    const [pathFile] = useAtom(pathFileAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [boundingBoxes, setBoundingBoxes] = useAtom(boundingBoxesAtom); // Bounding boxes de base
    const [isActiveDrawing, setIsActiveDrawing] = useAtom(activeCanvasDrawingAtom); // Contrôle du dessin
    const [showInputValue, setShowInputValue] = useAtom(activeInputValueAtom); // Contrôle des input values
    const [formBoxs, setformBoxs] = useAtom(formBoxsAtom); // Atome pour les invoiceElements

    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!pathFile) {
            setImageUrl(null);
            setImageError(null);
            setImageLoading(false);
            setformBoxs([]); // Réinitialiser formBoxs si pas de pathFile
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            setImageLoading(true);
            setImageError(null);

            try {
                // Paralléliser le chargement de l'image et des invoiceElements
                const [imageResult, elementsResult] = await Promise.all([
                    fetchInvoiceImage(pathFile),
                    invoiceId ? fetchInvoiceElements(invoiceId) : Promise.resolve({ success: false, data: [] }),
                ]);

                if (isMounted) {
                    // Gérer le résultat de l'image
                    if (imageResult.success) {
                        setImageUrl(imageResult.data); // Base64 data URL
                    } else {
                        setImageError(imageResult.error);
                        setImageUrl(null);
                    }
                    setImageLoading(false);

                    // Gérer le résultat des invoiceElements
                    if (elementsResult.success && elementsResult.data) {
                        setformBoxs(elementsResult.data); // Remplir formBoxs avec les invoiceElements
                    } else {
                        setformBoxs([]); // Réinitialiser si aucune donnée
                        if (elementsResult.error) {
                            setImageError(elementsResult.error); // Afficher l'erreur (optionnel)
                        }
                    }
                }
            } catch (error) {
                if (isMounted) {
                    setImageError(`Erreur lors du chargement: ${error.message}`);
                    setImageUrl(null);
                    setImageLoading(false);
                    setformBoxs([]); // Réinitialiser en cas d'erreur
                }
            }
        };

        loadImage();

        return () => {
            isMounted = false;
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [pathFile, invoiceId, setformBoxs]);

    // Utilisation de useActionState avec invoiceId inclus via closure
    const [submitState, submitAction, isPending] = useActionState<SubmitResult, BoundingBox[]>(
        async (_previousState: SubmitResult, validBoxes: BoundingBox[]) => {
            console.log("validbox: ici ce passe mon opération correctement: validbox:", validBoxes)
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
            setformBoxs([...submitState.elements, ...formBoxs]); // Ajouter les nouveaux éléments
            setBoundingBoxes([]); // Vider les boundingBoxes
        }
    }, [submitState, setformBoxs, formBoxs, setBoundingBoxes]);

    const handleNewDrawing = () => {
        setIsActiveDrawing(!isActiveDrawing);
    };

    const handleShowInputValue = () => {
        setShowInputValue(!showInputValue);
    };

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
        <div>
            <div>
                <button
                    onClick={handleNewDrawing}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isActiveDrawing ? "Ne plus dessiner" : "Dessiner des champs"}
                </button>
                <button
                    onClick={handleSubmit}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    disabled={isPending}
                >
                    {isPending ? "Soumission en cours..." : "Soumettre les boîtes"}
                </button>
                <button
                    onClick={handleShowInputValue}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {showInputValue ? "Cacher les valeurs" : "Afficher les valeurs"}
                </button>
            </div>

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
                        <BoundingBoxOverlay imageRef={imageRef} />
                        <BoundingBoxEditor imageRef={imageRef} />
                    </div>
                )}
                {!pathFile && !imageLoading && <p>Aucune facture sélectionnée</p>}
                {submitState && !submitState.success && <p className="error">Erreur : {submitState.error}</p>}
                {submitState && submitState.success && <p className="success">Succès : {submitState.message}</p>}
            </div>
        </div>
    );
}