"use client";

import DisplayFacture from "@/container/DisplayFactureCanvas/DisplayFacture";
import FormCanvasListDynamique from "@/container/FormCanvasDynamique/FormCanvasListDynamique";

import UploadForm from "@/container/UploadDocument/UploadForm";
import { Button } from "@/components/ui/button"; // Importer le composant Button de Shadcn UI
import { useAtom } from "jotai";
import LabelFieldFilterSheet, { filterOpenAtom } from "@/container/LabelFieldFilterSheet/LabelFieldFilterSheet";
import StickyPanel from "@/container/StickyPanelControle/StickyPanelControle";

export default function Home() {
    const [, setFilterOpen] = useAtom(filterOpenAtom); // Utiliser l'atome pour ouvrir la sheet

    return (
        <>
            <StickyPanel />

            <div>


                <div className="flex flex-col">

                    <div className="flex flex-row">
                        <DisplayFacture />
                        <FormCanvasListDynamique />
                    </div>
                </div>
            </div>

        </>
    )
}