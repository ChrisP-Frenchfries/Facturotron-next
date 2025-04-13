import { LabelField } from "@/container/FormCanvasDynamique/LabelFieldSelector";
import { bgColorOpacity30Map, borderColorMap, TailwindColor } from "@/data/mapageTailwind";
import { InvoiceElement } from "@/utils/canvas.action";

interface BBoxProps {
    element: InvoiceElement;
}

const getBorderColor = (couleurDefaut?: TailwindColor): string =>
    couleurDefaut ? borderColorMap[couleurDefaut] || "border-gray-500" : "border-gray-500";

const getbgColorOpacity = (couleurDefaut?: TailwindColor): string =>
    couleurDefaut ? bgColorOpacity30Map[couleurDefaut] || "bg-gray-500/30" : "bg-gray-500/30";

export default function BBox({ element }: BBoxProps) {
    const { id, boundingBox, selectedLabelField } = element;
    const color = selectedLabelField?.couleurDefaut;

    return (
        <div
            key={id}
            className={`absolute border-3 ${getBorderColor(color)} rounded-lg z-30 ${getbgColorOpacity(color)}`}
            style={{
                top: `${boundingBox.Top * 100}%`,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
                height: `${boundingBox.Height * 100}%`,
            }}
        />
    );
}