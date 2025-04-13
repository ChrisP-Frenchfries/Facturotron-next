"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";

interface BoundingBoxOverlayProps {
    imageRef: React.RefObject<HTMLImageElement | null>;
}

export default function BoundingBoxOverlay({ imageRef }: BoundingBoxOverlayProps) {
    const [formBoxs] = useAtom(formBoxsAtom);
    const [boxes, setBoxes] = useState<InvoiceElement[]>([]);

    // Update boxes when formBoxs changes
    useEffect(() => {

        console.log("Updating boxes:", formBoxs);
        setBoxes([...formBoxs]);

    }, [formBoxs]);

    if (!boxes || boxes.length === 0) {
        console.log("No boxes to display");
        return null;
    }

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {boxes.map((element) => {
                const { id, boundingBox, selectedLabelField, inputValue } = element;



                const boxColor = selectedLabelField?.couleurDefaut || "red";

                console.log(`Rendering box ${id} with color ${boxColor}`);

                // Dynamic Tailwind classes for border and background color


                return (
                    <div
                        key={id}
                        className={`absolute border-2 rounded-lg pointer-events-none z-30 ${boxColor ? boxColor : "border-r-red-500"} `}
                        style={{
                            top: `${boundingBox.Top * 100}%`,
                            left: `${boundingBox.Left * 100}%`,
                            width: `${boundingBox.Width * 100}%`,
                            height: `${boundingBox.Height * 100}%`,
                        }}
                    >
                        <div
                            className={`absolute -top-8 left-0 text-base font-bold font-arial flex items-center pointer-events-none z-20 ${boxColor}`}
                            style={{
                                height: `${boundingBox.Height * 100}%`,
                            }}
                        >
                            {inputValue || ""}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}