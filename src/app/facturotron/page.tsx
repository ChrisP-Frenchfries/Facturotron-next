"use client";

import DisplayFacture from "@/container/DisplayFactureCanvas/DisplayFacture";
import FormCanvasListDynamique from "@/container/FormCanvasDynamique/FormCanvasListDynamique";

import UploadForm from "@/container/UploadDocument/UploadForm";
import { Button } from "@/components/ui/button"; // Importer le composant Button de Shadcn UI
import { useAtom } from "jotai";
import LabelFieldFilterSheet, { filterOpenAtom } from "@/container/LabelFieldFilterSheet/LabelFieldFilterSheet";

export default function Home() {
    const [, setFilterOpen] = useAtom(filterOpenAtom); // Utiliser l'atome pour ouvrir la sheet

    return (
        <>
            <h1>Page de l'app</h1>
            <div>
                <div className="mb-4">
                    <h2>Display de la facture</h2>
                    <Button
                        onClick={() => setFilterOpen(true)}
                        className="bg-purple-500 hover:bg-purple-600"
                    >
                        Filtrer les champs
                    </Button>
                </div>

                <div className="flex flex-col">
                    <UploadForm />
                    <div className="flex flex-row">
                        <DisplayFacture />
                        <FormCanvasListDynamique />
                    </div>
                </div>
            </div>
            <LabelFieldFilterSheet /> {/* Ajouter le composant */}
        </>
    )
}