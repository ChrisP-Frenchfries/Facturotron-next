"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useAtom } from "jotai";
import FormCardInputDynamique from "@/container/FormCanvasDynamique/FormCardInputDynamique";
import { InvoiceElement } from "@/utils/canvas.action";
import { Button } from "@/components/ui/button";
import { formBoxsAtom } from "@/atom/canvas.atom";
import { formAddInvoiceElement, getReadyForPrintAction } from "@/utils/facture.action";
import { invoiceElementFinalRawAtom, invoiceIdAtom } from "@/atom/facture.atom";
import PrintDataModal from "../PrintDataModal/PrintDataModal";

export default function FormCanvasListDynamique() {


    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);




    const [invoiceElementFinalRaw, setinvoceElementFinalRaw] = useAtom(invoiceElementFinalRawAtom);//todo prerender des élément validé non envoyé
    // Utilisation de useActionState pour l'action d'impression
    const [printState, printAction, isPrintPending] = useActionState(getReadyForPrintAction, {
        success: false,
        error: null,
        message: '',
        data: [],
    });

    useEffect(() => {
        if (printState.success && printState.data.length > 0) {
            setIsModalOpen(true);
        }
    }, [printState]);

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


    const closeModal = () => {
        setIsModalOpen(false);
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
            <form action={formAction} className="space-y-6">
                <input type="hidden" name="invoiceId" value={invoiceId ? String(invoiceId) : ""} />
                <input type="hidden" name="formBoxs" value={JSON.stringify(formBoxs)} />
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
            {/* Formulaire séparé pour l'action d'impression */}
            <form action={printAction} className="mt-6 space-y-4">
                <div>
                    <label htmlFor="firmAccountingId" className="block text-sm font-medium mb-1">
                        ID de la société comptable :
                    </label>
                    <input
                        type="number"
                        id="firmAccountingId"
                        name="firmAccountingId"
                        required
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Entrez l'ID de la société"
                    />
                </div>
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium mb-1">
                        ID de l'utilisateur (optionnel) :
                    </label>
                    <input
                        type="number"
                        id="userId"
                        name="userId"
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Entrez l'ID de l'utilisateur (facultatif)"
                    />
                </div>
                <Button
                    type="submit"
                    className="w-full bg-purple-500 hover:bg-purple-600"
                    disabled={isPrintPending}
                >
                    {isPrintPending ? "Chargement des données..." : "Récupérer données impression"}
                </Button>
            </form>

            {/* Affichage des erreurs ou messages hors de la modale */}
            {printState.error && (
                <p className="mt-2 text-sm text-red-500">Erreur : {printState.error}</p>
            )}
            {printState.success && printState.message && printState.data.length === 0 && (
                <p className="mt-2 text-sm text-blue-500">{printState.message}</p>
            )}
            {printState.success && printState.data.length === 0 && (
                <p className="mt-2 text-sm text-gray-500">
                    Aucune facture trouvée pour cette société comptable.
                </p>
            )}

            {/* Modale pour afficher les données récupérées */}
            {isModalOpen && (
                <PrintDataModal
                    data={printState.data}
                    onClose={closeModal}
                />
            )}


        </div>
    );
}