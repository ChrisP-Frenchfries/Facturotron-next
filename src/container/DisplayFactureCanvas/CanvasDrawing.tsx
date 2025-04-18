"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { activeCanvasDrawingAtom } from "@/atom/canvas.atom";

interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

interface CanvasDrawingProps {
    imageRef: React.RefObject<HTMLImageElement | null>;
    boundingBoxes: BoundingBox[];
    setBoundingBoxes: (
        boxes: BoundingBox[] | ((prev: BoundingBox[]) => BoundingBox[])
    ) => void;
}

export default function CanvasDrawing({
    imageRef,
    boundingBoxes,
    setBoundingBoxes,
}: CanvasDrawingProps) {
    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState<number | null>(null);
    const [isResizing, setIsResizing] = useState<{
        index: number;
        handle: string;
    } | null>(null);
    const [tempBox, setTempBox] = useState<BoundingBox | null>(null);
    const [isActive] = useAtom(activeCanvasDrawingAtom);

    const MIN_SIZE = 0.001;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isActive) return;

        e.preventDefault();
        if (!imageRef.current || isDragging !== null || isResizing !== null) return;

        const rect = imageRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setIsDrawing(true);
        setStartPos({ x, y });
    };

    const handleCanvasMouseDown = (
        e: React.MouseEvent<HTMLDivElement>,
        index: number,
        handle?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    ) => {
        if (!isActive) return;

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
                Width: Math.max(MIN_SIZE, width / imageWidth),
                Height: Math.max(MIN_SIZE, height / imageHeight),
            };

            setTempBox((prev) => {
                // Éviter les mises à jour inutiles
                if (
                    prev &&
                    prev.Top === newBox.Top &&
                    prev.Left === newBox.Left &&
                    prev.Width === newBox.Width &&
                    prev.Height === newBox.Height
                ) {
                    return prev;
                }
                return newBox;
            });
        } else if (isDragging !== null && startPos) {
            const dx = (currentX - startPos.x) / imageWidth;
            const dy = (currentY - startPos.y) / imageHeight;

            setBoundingBoxes((prev) => {
                const updated = [...prev];
                const box = updated[isDragging];
                const newLeft = Math.max(0, Math.min(1 - box.Width, box.Left + dx));
                const newTop = Math.max(0, Math.min(1 - box.Height, box.Top + dy));

                // Éviter les mises à jour si la position n'a pas changé
                if (box.Left === newLeft && box.Top === newTop) {
                    return prev;
                }

                updated[isDragging] = {
                    ...box,
                    Left: newLeft,
                    Top: newTop,
                };
                return updated;
            });

            // Mettre à jour startPos uniquement si nécessaire
            setStartPos((prev) => {
                if (prev && prev.x === currentX && prev.y === currentY) {
                    return prev;
                }
                return { x: currentX, y: currentY };
            });
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
                        box.Width = Math.min(
                            box.Width + (box.Left - Math.max(0, box.Left + dx)),
                            1 - box.Left
                        );
                        box.Top = Math.max(0, box.Top + dy);
                        box.Height = Math.min(
                            box.Height + (box.Top - Math.max(0, box.Top + dy)),
                            1 - box.Top
                        );
                        break;
                    case "top-right":
                        box.Width = Math.min(1 - box.Left, box.Width + dx);
                        box.Top = Math.max(0, box.Top + dy);
                        box.Height = Math.min(
                            box.Height + (box.Top - Math.max(0, box.Top + dy)),
                            1 - box.Top
                        );
                        break;
                    case "bottom-left":
                        box.Left = Math.max(0, box.Left + dx);
                        box.Width = Math.min(
                            box.Width + (box.Left - Math.max(0, box.Left + dx)),
                            1 - box.Left
                        );
                        box.Height = Math.min(1 - box.Top, box.Height + dy);
                        break;
                    case "bottom-right":
                        box.Width = Math.min(1 - box.Left, box.Width + dx);
                        box.Height = Math.min(1 - box.Top, box.Height + dy);
                        break;
                }
                box.Width = Math.max(MIN_SIZE, box.Width);
                box.Height = Math.max(MIN_SIZE, box.Height);

                // Éviter les mises à jour si la boîte n'a pas changé
                if (
                    box.Left === updated[index].Left &&
                    box.Top === updated[index].Top &&
                    box.Width === updated[index].Width &&
                    box.Height === updated[index].Height
                ) {
                    return prev;
                }

                updated[index] = box;
                return updated;
            });

            setStartPos((prev) => {
                if (prev && prev.x === currentX && prev.y === currentY) {
                    return prev;
                }
                return { x: currentX, y: currentY };
            });
        }
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (isDrawing && tempBox) {
            setIsDrawing(false);
            setStartPos(null);
            if (tempBox.Width >= MIN_SIZE && tempBox.Height >= MIN_SIZE) {
                setBoundingBoxes((prev) => [...prev, tempBox]);
            }
            setTempBox(null);
        }
        setIsDragging(null);
        setIsResizing(null);
    };

    const handleDeleteBox = (index: number) => {
        if (!isActive) return;
        setBoundingBoxes((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: isActive ? 50 : 10,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
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
                        cursor: isActive ? "move" : "default",
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
                            cursor: isActive ? "nwse-resize" : "default",
                            display: isActive ? "block" : "none",
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
                            cursor: isActive ? "nesw-resize" : "default",
                            display: isActive ? "block" : "none",
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
                            cursor: isActive ? "nesw-resize" : "default",
                            display: isActive ? "block" : "none",
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
                            cursor: isActive ? "nwse-resize" : "default",
                            display: isActive ? "block" : "none",
                        }}
                        onMouseDown={(e) => handleCanvasMouseDown(e, index, "bottom-right")}
                    />
                    <div
                        style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            width: "10px",
                            height: "10px",
                            background: "black",
                            color: "white",
                            textAlign: "center",
                            lineHeight: "10px",
                            cursor: isActive ? "pointer" : "default",
                            fontSize: "10px",
                            zIndex: 20,
                            display: isActive ? "block" : "none",
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBox(index);
                        }}
                    >
                        ✕
                    </div>
                </div>
            ))}
            {tempBox && isActive && (
                <div
                    style={{
                        position: "absolute",
                        top: `${tempBox.Top * 100}%`,
                        left: `${tempBox.Left * 100}%`,
                        width: `${tempBox.Width * 100}%`,
                        height: `${tempBox.Height * 100}%`,
                        border: "2px dashed red",
                        pointerEvents: "none",
                    }}
                />
            )}
        </div>
    );
}