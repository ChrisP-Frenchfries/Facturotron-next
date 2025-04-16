"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { InvoiceElement, makeInvoiceElements } from "@/utils/canvas.action";
import { fetchInvoiceImage, fetchInvoiceElements } from "@/utils/facture.action";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useRef, useState, startTransition } from "react";
import { useActionState } from "react";
import CanvasDrawing from "./CanvasDrawing";
import { activeCanvasDrawingAtom, activeInputValueAtom, boundingBoxesAtom, formBoxsAtom } from "@/atom/canvas.atom";
import BoundingBoxEditor from "./BoundingBoxEditor";
import BoundingBoxOverlay from "./BoundingBoxOverLay/BoundingBoxOverlay";
import { trigerSoumettreBoites } from "@/atom/header.atom";

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
    const [invoiceId] = useAtom(invoiceIdAtom);
    const [pathFile] = useAtom(pathFileAtom);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [imageLoading, setImageLoading] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);
    const [boundingBoxes, setBoundingBoxes] = useAtom(boundingBoxesAtom);
    const [isActiveDrawing, setIsActiveDrawing] = useAtom(activeCanvasDrawingAtom);
    const [showInputValue, setShowInputValue] = useAtom(activeInputValueAtom);
    const [formBoxs, setformBoxs] = useAtom(formBoxsAtom);

    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (!pathFile) {
            setImageUrl(null);
            setImageError(null);
            setImageLoading(false);
            setformBoxs([]);
            return;
        }

        let isMounted = true;

        const loadImage = async () => {
            setImageLoading(true);
            setImageError(null);

            try {
                const [imageResult, elementsResult] = await Promise.all([
                    fetchInvoiceImage(pathFile),
                    invoiceId ? fetchInvoiceElements(invoiceId) : Promise.resolve({ success: false, data: [] }),
                ]);

                if (isMounted) {
                    if (imageResult.success) {
                        setImageUrl(imageResult.data);
                    } else {
                        setImageError(imageResult.error);
                        setImageUrl(null);
                    }
                    setImageLoading(false);

                    if (elementsResult.success && elementsResult.data) {
                        setformBoxs(elementsResult.data);
                    } else {
                        setformBoxs([]);
                        if (elementsResult.error) {
                            setImageError(elementsResult.error);
                        }
                    }
                }
            } catch (error: any) {
                if (isMounted) {
                    setImageError(`Erreur lors du chargement: ${error.message}`);
                    setImageUrl(null);
                    setImageLoading(false);
                    setformBoxs([]);
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

    const [submitState, submitAction, isPending] = useActionState<SubmitResult, BoundingBox[]>(
        async (_previousState: SubmitResult, validBoxes: BoundingBox[]) => {
            if (!invoiceId) {
                return { success: false, error: "ID de facture manquant" };
            }
            console.log("Submitting boxes:", validBoxes);
            return await makeInvoiceElements(invoiceId, validBoxes);
        },
        null
    );

    useEffect(() => {
        if (submitState?.success && Array.isArray(submitState.elements)) {
            console.log("Updating formBoxs with:", submitState.elements);
            setformBoxs((prev) => {
                // Éviter les mises à jour si les données sont identiques
                const newElements = submitState.elements!;
                if (
                    prev.length === newElements.length &&
                    prev.every((item, i) => item.id === newElements[i].id)
                ) {
                    return prev;
                }
                return [...newElements, ...prev];
            });
            setBoundingBoxes([]); // Vider boundingBoxes pour permettre de nouvelles créations
        }
    }, [submitState, setformBoxs, setBoundingBoxes]);

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
            submitAction(validBoxes);
        });
    };

    const triggerSubmit = useAtomValue(trigerSoumettreBoites)

    useEffect(() => {

        handleSubmit();

    }, [triggerSubmit]);

    return (
        <div>


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