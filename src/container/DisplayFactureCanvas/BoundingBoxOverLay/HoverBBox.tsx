import { InvoiceElement } from "@/utils/canvas.action";

interface HoverBBoxProps {
    element: InvoiceElement;
    isHovered: boolean;
}

export default function HoverBBox({ element, isHovered }: HoverBBoxProps) {
    const { id, boundingBox, inputValue, selectedLabelField } = element;

    console.log(`HoverBBox for id=${id}, isHovered=${isHovered}`); // Debug log

    return (
        <div
            key={`hover-${id}`}
            className={`absolute bg-white/50 shadow-lg rounded-lg p-2 text-sm backdrop-blur-sm text-center ${isHovered ? "block" : "hidden"
                } z-40`} // Increased z-index, more opacity for visibility
            style={{
                top: `${boundingBox.Top * 100}%`,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
            }}
        >
            <p>{selectedLabelField?.label || "No Label"}</p>
            <p>{inputValue || "No Value"}</p>
        </div>
    );
}