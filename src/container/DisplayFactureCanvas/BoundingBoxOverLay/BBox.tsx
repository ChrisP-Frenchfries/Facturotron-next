import { LabelField } from "@/container/FormCanvasDynamique/LabelFieldSelector";
import { bgColorOpacity30Map, borderColorMap, classicColorMap, TailwindColor } from "@/data/mapageTailwind";
import { InvoiceElement } from "@/utils/canvas.action";





interface BBoxProps {
    element: InvoiceElement;
}

const getClassicColor = (couleurDefaut?: TailwindColor): string =>
    couleurDefaut ? classicColorMap[couleurDefaut] || "gray-500" : "gray-500";

const getBorderColor = (couleurDefaut?: TailwindColor): string =>
    couleurDefaut ? borderColorMap[couleurDefaut] || "border-gray-500" : "border-gray-500";


const getbgColorOpacity = (couleurDefaut?: TailwindColor): string =>
    couleurDefaut ? bgColorOpacity30Map[couleurDefaut] || "border-gray-500" : "border-gray-500";

export default function BBox({ element }: BBoxProps) {
    const { id, boundingBox, selectedLabelField } = element;

    const color = selectedLabelField?.couleurDefaut ?? "bg-red-500";


    return (
        <div
            key={id}
            className={`absolute border-3 ${getBorderColor(color)} rounded-lg pointer-events-none z-30 ${getbgColorOpacity(color)} `}
            style={{
                top: `${boundingBox.Top * 100}%`,
                left: `${boundingBox.Left * 100}%`,
                width: `${boundingBox.Width * 100}%`,
                height: `${boundingBox.Height * 100}%`,
            }}
        >

        </div>

    );
}