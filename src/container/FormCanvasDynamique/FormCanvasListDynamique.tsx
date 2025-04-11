"use client";

import React from "react";
import { useAtom } from "jotai";
import FormCardInputDynamique from "@/container/FormCanvasDynamique/FormCardInputDynamique";

import { InvoiceElement } from "@/utils/canvas.action";
import { Button } from "@/components/ui/button";
import { formBoxsAtom } from "@/atom/canvas.atom";

export default function FormCanvasListDynamique() {
    const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);

    const addFormCard = () => {
        const newElement: InvoiceElement = {
            id: Date.now().toString(),
            nom: `Champ ${formBoxs.length + 1}`,
            boundingBox: { Top: 10, Left: 10, Width: 100, Height: 50 },
            blocks: [
                {
                    BlockType: "WORD",
                    Text: `Valeur ${formBoxs.length + 1}`,
                    Geometry: { BoundingBox: { Top: 10, Left: 10, Width: 100, Height: 50 } },
                    Id: `block-${Date.now()}`,
                },
            ],
            confidence: 0.95,
        };
        setFormBoxs((prev) => [...prev, newElement]);
    };


    const clearCardList = () => {

        setFormBoxs([])

    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Données soumises:", formBoxs);
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="space-y-6">
                <Button
                    type="button"
                    onClick={addFormCard}
                    className="mb-4 bg-blue-500 hover:bg-blue-600"
                >
                    Ajouter un champ
                </Button>
                <Button
                    type="button"
                    onClick={clearCardList}
                    className="mb-4 bg-blue-500 hover:bg-blue-600"
                >
                    clear all
                </Button>
                <div className="space-y-4">
                    {formBoxs.length === 0 ? (
                        <p className="text-muted-foreground">
                            Aucun champ pour l'instant. Ajoutez-en un pour commencer.
                        </p>
                    ) : (
                        formBoxs.map((element) => (
                            <FormCardInputDynamique key={element.id} {...element} />
                        ))
                    )}
                </div>
                {formBoxs.length > 0 && (
                    <Button type="submit" className="w-full bg-green-500 hover:bg-green-600">
                        Soumettre le formulaire
                    </Button>
                )}
            </form>
        </div>
    );
}