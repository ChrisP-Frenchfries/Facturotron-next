"use client";

import React, { useActionState } from "react";
import { useAtom } from "jotai";
import FormCardInputDynamique from "@/container/FormCanvasDynamique/FormCardInputDynamique";
import { InvoiceElement } from "@/utils/canvas.action";
import { Button } from "@/components/ui/button";
import { formBoxsAtom } from "@/atom/canvas.atom";
import { formAddInvoiceElement } from "@/utils/facture.action";
import { invoiceIdAtom } from "@/atom/facture.atom";

export default function FormCanvasListDynamique() {


    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
    const [state, formAction, isPending] = useActionState(formAddInvoiceElement, { message: null });

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
        formBoxs.forEach((element) => {
            localStorage.removeItem(`${element.id}-boundingBox`);
            localStorage.removeItem(`${element.id}-value`);
            localStorage.removeItem(`${element.id}-selectedLabelField`);
        });
        setFormBoxs([]);
    };

    return (
        <div className="p-4">
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="invoiceId" value={invoiceId ? String(invoiceId) : ""} />
                <input type="hidden" name="formBoxs" value={JSON.stringify(formBoxs)} />
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
                    Clear all
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
                    <Button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-green-600"
                        disabled={isPending}
                    >
                        {isPending ? "Soumission..." : "Soumettre le formulaire"}
                    </Button>
                )}
                {state?.message && (
                    <p className="mt-2 text-sm text-red-500">{state.message}</p>
                )}
            </form>
        </div>
    );
}