"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { submitBoundingBoxes } from "@/utils/canvas.action";
import { fetchInvoiceImage } from "@/utils/client-actions";
import { useAtom } from "jotai";
import { useEffect, useState, useRef } from "react";

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
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState<{ index: number; handle: string } | null>(null);

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

    // Gestion du dessin initial
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!imageRef.current || isDragging !== null || isResizing !== null) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });
    };

    // Gestion du drag-and-drop et resize
    const handleCanvasMouseDown = (
        e: React.MouseEvent<HTMLDivElement>, // Corrigé pour <div>
        index: number,
        handle?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    ) => {
        e.preventDefault();
        e.stopPropagation();

        if (!imageRef.current) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (handle) {
            setIsResizing({ index, handle });
            setStartPos({ x, y });
        } else {
            setIsDragging(index);
            setStartPos({ x, y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        const imageWidth = rect.width;
        const imageHeight = rect.height;

        if (isDrawing && startPos) {
            const width = Math.abs(currentX - startPos.x);
            const height = Math.abs(currentY - startPos.y);
            const left = Math.min(startPos.x, currentX);
            const top = Math.min(startPos.y, currentY);

            const newBox: BoundingBox = {
                Top: top / imageHeight,
                Left: left / imageWidth,
                Width: width / imageWidth,
                Height: height / imageHeight,
            };

            setBoundingBoxes((prev) => {
                const updated = [...prev];
                if (updated.length > 0) {
                    updated[updated.length - 1] = newBox;
                } else {
                    updated.push(newBox);
                }
                return updated;
            });
        } else if (isDragging !== null && startPos) {
            const dx = (currentX - startPos.x) / imageWidth;
            const dy = (currentY - startPos.y) / imageHeight;

            setBoundingBoxes((prev) => {
                const updated = [...prev];
                const box = updated[isDragging];
                updated[isDragging] = {
                    ...box,
                    Left: Math.max(0, Math.min(1 - box.Width, box.Left + dx)),
                    Top: Math.max(0, Math.min(1 - box.Height, box.Top + dy)),
                };
                return updated;
            });
            setStartPos({ x: currentX, y: currentY });
        } else if (isResizing && startPos) {
            const { index, handle } = isResizing;
            const dx = (currentX - startPos.x) / imageWidth;
            const dy = (currentY - startPos.y) / imageHeight;

            setBoundingBoxes((prev) => {
                const updated = [...prev];
                const box = { ...updated[index] };

                switch (handle) {
                    case "top-left":
                        box.Left = Math.max(0, box.Left + dx);
                        box.Width = Math.min(box.Width + (box.Left - Math.max(0, box.Left + dx)), 1 - box.Left);
                        box.Top = Math.max(0, box.Top + dy);
                        box.Height = Math.min(box.Height + (box.Top - Math.max(0, box.Top + dy)), 1 - box.Top);
                        break;
                    case "top-right":
                        box.Width = Math.min(1 - box.Left, box.Width + dx);
                        box.Top = Math.max(0, box.Top + dy);
                        box.Height = Math.min(box.Height + (box.Top - Math.max(0, box.Top + dy)), 1 - box.Top);
                        break;
                    case "bottom-left":
                        box.Left = Math.max(0, box.Left + dx);
                        box.Width = Math.min(box.Width + (box.Left - Math.max(0, box.Left + dx)), 1 - box.Left);
                        box.Height = Math.min(1 - box.Top, box.Height + dy);
                        break;
                    case "bottom-right":
                        box.Width = Math.min(1 - box.Left, box.Width + dx);
                        box.Height = Math.min(1 - box.Top, box.Height + dy);
                        break;
                }

                updated[index] = box;
                return updated;
            });
            setStartPos({ x: currentX, y: currentY });
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isDrawing) {
            setIsDrawing(false);
            setStartPos(null);
            if (
                !boundingBoxes.length ||
                (boundingBoxes[boundingBoxes.length - 1].Width > 0 &&
                    boundingBoxes[boundingBoxes.length - 1].Height > 0)
            ) {
                setBoundingBoxes((prev) => [...prev, { Top: 0, Left: 0, Width: 0, Height: 0 }]);
            }
        }
        setIsDragging(null);
        setIsResizing(null);
    };

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
        <div
            className="facture-display"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ userSelect: "none" }}
        >
            {loading && <p>Chargement de l'image...</p>}
            {error && <p className="error">Erreur : {error}</p>}
            {imageUrl && !loading && (
                <div
                    style={{ position: "relative", display: "inline-block" }}
                    onMouseDown={handleMouseDown}
                >
                    <img
                        ref={imageRef}
                        src={imageUrl}
                        alt={`Facture ${invoiceId || ""}`}
                        style={{ maxWidth: "100%", height: "auto" }} // Suppression de userDrag
                        draggable={false}
                        onError={() => {
                            setError("Erreur lors du chargement de l'image");
                            setImageUrl(null);
                        }}
                    />
                    {boundingBoxes.map((box, index) => (
                        <div
                            key={index}
                            style={{
                                position: "absolute",
                                top: `${box.Top * 100}%`,
                                left: `${box.Left * 100}%`,
                                width: `${box.Width * 100}%`,
                                height: `${box.Height * 100}%`,
                                border: "2px solid red",
                                cursor: "move",
                            }}
                            onMouseDown={(e) => handleCanvasMouseDown(e, index)}
                        >
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-5px",
                                    left: "-5px",
                                    width: "10px",
                                    height: "10px",
                                    background: "blue",
                                    cursor: "nwse-resize",
                                }}
                                onMouseDown={(e) => handleCanvasMouseDown(e, index, "top-left")}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    top: "-5px",
                                    right: "-5px",
                                    width: "10px",
                                    height: "10px",
                                    background: "blue",
                                    cursor: "nesw-resize",
                                }}
                                onMouseDown={(e) => handleCanvasMouseDown(e, index, "top-right")}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-5px",
                                    left: "-5px",
                                    width: "10px",
                                    height: "10px",
                                    background: "blue",
                                    cursor: "nesw-resize",
                                }}
                                onMouseDown={(e) => handleCanvasMouseDown(e, index, "bottom-left")}
                            />
                            <div
                                style={{
                                    position: "absolute",
                                    bottom: "-5px",
                                    right: "-5px",
                                    width: "10px",
                                    height: "10px",
                                    background: "blue",
                                    cursor: "nwse-resize",
                                }}
                                onMouseDown={(e) => handleCanvasMouseDown(e, index, "bottom-right")}
                            />
                        </div>
                    ))}
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