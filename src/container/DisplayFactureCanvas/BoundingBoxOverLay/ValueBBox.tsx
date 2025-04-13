import { useAtom } from 'jotai';
import { InvoiceElement } from '@/utils/canvas.action';
import { activeInputValue } from '@/atom/canvas.atom';


interface ValueBBoxProps {
    element: InvoiceElement;
}

export default function ValueBBox({ element }: ValueBBoxProps) {
    const { id, boundingBox, inputValue } = element;
    const [isActive] = useAtom(activeInputValue);

    // Calcul de la position du label en dessous de la box
    const labelTop = `${(boundingBox.Top + boundingBox.Height) * 100}%`;

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
            <p>{inputValue}</p>
        </div>
    );
}