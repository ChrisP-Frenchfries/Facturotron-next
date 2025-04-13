import { InvoiceElement } from "@/utils/canvas.action";

interface HoverBBoxProps {
    element: InvoiceElement;
}

export default function HoverBBox({ element }: HoverBBoxProps) {
    const { id, boundingBox, inputValue, selectedLabelField } = element;
    selectedLabelField?.label

    return (
        <div
            key={id}
            className={`absolute bg-white/30 shadow-lg rounded-lg p-2 text-sm backdrop-blur-sm text-center ${isActive ? 'block' : 'hidden'
                }`} // Card semi-transparente, police réduite, visibilité contrôlée
            style={{
                top: labelTop,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
            }}
        >
            <p>{selectedLabelField?.label}</p>
            <p>{inputValue}</p>
        </div>
    );
}