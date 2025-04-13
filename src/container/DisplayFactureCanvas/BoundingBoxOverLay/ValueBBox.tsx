import { InvoiceElement } from "@/utils/canvas.action";


interface ValueBBoxProps {
    element: InvoiceElement;
}


export default function ValueBBox({ element }: ValueBBoxProps) {
    const { id, boundingBox, inputValue } = element;

    // Calcul de la position du label en dessous de la box
    const labelTop = `${(boundingBox.Top + boundingBox.Height) * 100}%`;

    return (
        <div
            key={id}
            className="absolute"
            style={{
                top: labelTop,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
                textAlign: "center", // Pour centrer le texte
            }}
        >
            <p>{inputValue}</p>
        </div>
    );
}