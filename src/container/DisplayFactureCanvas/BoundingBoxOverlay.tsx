"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";

interface BoundingBoxOverlayProps {
    imageRef: React.RefObject<HTMLImageElement | null>;
}

export default function BoundingBoxOverlay({ imageRef }: BoundingBoxOverlayProps) {
    const [formBoxs] = useAtom(formBoxsAtom);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const image = imageRef.current;
        if (!canvas || !image) {
            console.log("Canvas ou image manquant:", { canvas: !!canvas, image: !!image });
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            console.log("Contexte 2D manquant");
            return;
        }

        const updateCanvasSize = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            canvas.style.width = `${image.width}px`;
            canvas.style.height = `${image.height}px`;
            console.log("Taille du canvas mise à jour:", {
                width: canvas.width,
                height: canvas.height,
            });
        };

        updateCanvasSize();
        const observer = new ResizeObserver(updateCanvasSize);
        observer.observe(image);

        return () => observer.unobserve(image);
    }, [imageRef]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            console.log("Canvas non disponible");
            return;
        }

        const context = canvas.getContext("2d");
        if (!context) {
            console.log("Contexte 2D non disponible");
            return;
        }

        const drawBoundingBoxes = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const image = imageRef.current;
            if (!image) {
                console.log("Image non disponible pour le dessin");
                return;
            }

            console.log("Nombre de formBoxs:", formBoxs.length);
            console.log("formBoxs:", formBoxs);

            formBoxs.forEach((element: InvoiceElement, index: number) => {
                const { boundingBox, id, selectedLabelField } = element;
                // Vérifier que boundingBox contient des valeurs valides
                if (
                    !boundingBox ||
                    isNaN(boundingBox.Left) ||
                    isNaN(boundingBox.Top) ||
                    isNaN(boundingBox.Width) ||
                    isNaN(boundingBox.Height)
                ) {
                    console.log(`Boîte invalide pour ID ${id}:`, boundingBox);
                    return;
                }

                // Les coordonnées sont normalisées entre 0 et 1 (comme dans BoundingBoxEditor)
                const x = boundingBox.Left * canvas.width;
                const y = boundingBox.Top * canvas.height;
                const width = boundingBox.Width * canvas.width;
                const height = boundingBox.Height * canvas.height;

                console.log(`Dessin de la boîte ${index} (ID: ${id}):`, {
                    x,
                    y,
                    width,
                    height,
                    boundingBox,
                });

                context.strokeStyle = selectedLabelField?.couleurDefaut ?? "red";
                context.lineWidth = 2;
                context.font = "14px Arial";
                context.fillStyle = selectedLabelField?.couleurDefaut ?? "red";

                context.strokeRect(x, y, width, height);
                const label = selectedLabelField?.label ?? id;
                context.fillText(label, x, y - 5);
            });
        };

        drawBoundingBoxes();
    }, [formBoxs, imageRef]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                pointerEvents: "none",
                border: "1px solid blue", // Bordure temporaire pour visualiser
            }}
        />
    );
}