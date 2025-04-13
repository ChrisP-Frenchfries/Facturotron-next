"use client";

import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";
import BBox from "./BBox";
import ValueBBox from "./ValueBBox";
import HoverBBox from "./HoverBBox";

interface BoundingBoxOverlayProps {
    imageRef: React.RefObject<HTMLImageElement | null>;
}

export default function BoundingBoxOverlay({ imageRef }: BoundingBoxOverlayProps) {
    const [formBoxs] = useAtom(formBoxsAtom);
    const [boxes, setBoxes] = useState<InvoiceElement[]>([]);
    const [hoveredBoxId, setHoveredBoxId] = useState<string | null>(null); // Track hovered box

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
                const { id } = element;

                return (
                    <div
                        key={id}
                        className="pointer-events-auto" // Enable pointer events for hover
                        onMouseEnter={() => setHoveredBoxId(id)} // Set hovered box
                        onMouseLeave={() => setHoveredBoxId(null)} // Clear hovered box
                    >
                        <BBox element={element} />
                        <HoverBBox element={element} isHovered={hoveredBoxId === id} />
                        <ValueBBox element={element} />
                    </div>
                );
            })}
        </div>
    );
}