import { InvoiceElement } from "@/utils/canvas.action";


interface ValueBBoxProps {
    element: InvoiceElement;
}


export default function ValueBBox({ element }: ValueBBoxProps) {
    const { id, boundingBox, selectedLabelField, inputValue } = element;
    return (
        <div
            className={``}
        >

        </div>
    );
}
