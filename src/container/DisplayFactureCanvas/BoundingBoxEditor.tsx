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
import { ZoomIn, ZoomOut } from "lucide-react";

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
    const [zoomLevel, setZoomLevel] = useState(1); // Niveau de zoom initial à 1 (100%)

    const imageRef = useRef<HTMLImageElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

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

    const triggerSubmit = useAtomValue(trigerSoumettreBoites);

    useEffect(() => {
        handleSubmit();
    }, [triggerSubmit]);

    // Gestion du zoom (modifie uniquement la largeur de la div)
    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 0.1, 2)); // Limite maximale de zoom à 200%
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 0.1, 0.5)); // Limite minimale de zoom à 50%
    };

    return (
        <div>
            <div className="facture-display" style={{ userSelect: "none" }}>
                {imageLoading && <p>Chargement de l'image...</p>}
                {imageError && <p className="error">Erreur : {imageError}</p>}
                {imageUrl && !imageLoading && (
                    <>
                        {/* Header sticky avec boutons de zoom */}
                        <div
                            className="sticky top-0 z-10 w-full bg-transparent border-b border-[#B8D8BA] shadow-sm"
                            style={{ backgroundColor: "rgba(230, 242, 225, 0.8)" }}
                        >
                            <div className="flex items-center justify-start h-10 px-4">
                                <button
                                    onClick={handleZoomIn}
                                    className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
                                    disabled={zoomLevel >= 2}
                                >
                                    <ZoomIn size={16} />
                                    <span>Zoom +</span>
                                </button>
                                <button
                                    onClick={handleZoomOut}
                                    className="flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200 ml-2"
                                    disabled={zoomLevel <= 0.5}
                                >
                                    <ZoomOut size={16} />
                                    <span>Zoom -</span>
                                </button>
                            </div>
                        </div>

                        {/* Conteneur de l'image avec zoom affectant uniquement la largeur */}
                        <div
                            ref={containerRef}
                            style={{
                                position: "relative",
                                width: `${100 * zoomLevel}%`, // La largeur change avec le zoom
                                height: "calc(100vh - 140px)", // Hauteur fixe ajustée pour le header
                                overflowY: "auto", // Barre de défilement verticale si l'image dépasse
                                overflowX: "visible", // Pas de troncature en largeur
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-start", // Alignement au début pour le défilement
                            }}
                        >
                            <img
                                ref={imageRef}
                                src={imageUrl}
                                alt={`Facture ${invoiceId || ""}`}
                                style={{
                                    width: "100%", // L'image prend toute la largeur du conteneur
                                    height: "auto", // Hauteur automatique pour maintenir le ratio
                                }}
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
                            {/* <BoundingBoxEditor imageRef={imageRef} /> pour plus tard */}
                        </div>
                    </>
                )}
                {!pathFile && !imageLoading && <p>Aucune facture sélectionnée</p>}
                {submitState && !submitState.success && <p className="error">Erreur : {submitState.error}</p>}
                {submitState && submitState.success && <p className="success">Succès : {submitState.message}</p>}
            </div>
        </div>
    );
}