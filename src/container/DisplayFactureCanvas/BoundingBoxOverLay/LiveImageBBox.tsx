"use client";

import { useEffect, useState } from "react";
import { InvoiceElement } from "@/utils/canvas.action";

interface LiveImageBBoxProps {
    element: InvoiceElement;
    imageRef: React.RefObject<HTMLImageElement>;
}

export default function LiveImageBBox({ element, imageRef }: LiveImageBBoxProps) {
    const { id, boundingBox } = element;
    const [imageSrc, setImageSrc] = useState("");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const img = imageRef.current;
        if (img && img.src) {
            setImageSrc(img.src);
        }
    }, [imageRef]);

    if (!isClient || !imageSrc) {
        return null; // Évite le rendu côté serveur
    }

    return (
        <div
            key={`live-img-${id}`}
            className="absolute overflow-hidden"
            style={{
                top: `${boundingBox.Top * 100}%`,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
                height: `${boundingBox.Height * 100}%`,
            }}
        >
            <img
                src={imageSrc}
                alt={`Region ${id}`}
                className="absolute"
                style={{
                    top: `-${boundingBox.Top * 100}%`,
                    left: `-${boundingBox.Left * 100}%`,
                    width: `${1 / boundingBox.Width * 100}%`,
                    height: `${1 / boundingBox.Height * 100}%`,
                }}
            />
        </div>
    );
}