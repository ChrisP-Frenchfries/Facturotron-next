"use client";

import { useEffect, useRef } from "react";
import { useAtom } from "jotai";
import { formBoxsAtom } from "@/atom/canvas.atom";
import { useAtomMap } from "./FormAtomProvider";
import { LabelField } from "./LabelFieldSelector";

interface FormCanvasDrawingProps {
    id: string;
}

export default function FormCanvasDrawing({ id }: FormCanvasDrawingProps) {
    const atomMap = useAtomMap();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Récupérer les atomes
    const boundingBoxAtom = atomMap.get(`${id}-boundingBox`);
    const inputValueAtom = atomMap.get(`${id}-inputValue`);
    const selectedLabelFieldAtom = atomMap.get(`${id}-selectedLabelField`);

    if (!boundingBoxAtom || !inputValueAtom || !selectedLabelFieldAtom) {
        console.warn(`Atomes non trouvés pour l'ID ${id}`);
        return <div>Erreur : Élément avec ID {id} non trouvé</div>;
    }

    const [currentBoundingBox] = useAtom(boundingBoxAtom);
    const [inputValue] = useAtom(inputValueAtom);
    const [selectedLabelField] = useAtom(selectedLabelFieldAtom);
    const [, setFormBoxs] = useAtom(formBoxsAtom);

    // Synchroniser formBoxsAtom
    useEffect(() => {
        setFormBoxs((prev) =>
            prev.map((element) =>
                element.id === id
                    ? { ...element, inputValue, selectedLabelField }
                    : element
            )
        );
    }, [id, inputValue, selectedLabelField, setFormBoxs]);

    // Dessiner sur le canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas && currentBoundingBox) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.strokeStyle = "blue";
                ctx.strokeRect(
                    currentBoundingBox.Left,
                    currentBoundingBox.Top,
                    currentBoundingBox.Width,
                    currentBoundingBox.Height
                );
                ctx.fillStyle = "black";
                ctx.fillText(inputValue || "", currentBoundingBox.Left + 5, currentBoundingBox.Top + 20);
            }
        }
    }, [currentBoundingBox, inputValue]);

    return (
        <div>
            <h2>FormCanvasDrawing pour ID: {id}</h2>
            <canvas
                ref={canvasRef}
                width={800} // Ajuste selon tes besoins
                height={600}
                style={{ border: "1px solid black" }}
            />
            <p>Input Value: {inputValue || "Aucune valeur"}</p>
            <p>Selected Label Field: {selectedLabelField?.label || "Aucun"}</p>
        </div>
    );
}