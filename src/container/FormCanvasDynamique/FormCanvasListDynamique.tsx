"use client";

import React, { useActionState, useEffect, useState } from "react";
import { useAtom } from "jotai";
import FormCardInputDynamique from "@/container/FormCanvasDynamique/FormCardInputDynamique";
import { InvoiceElement } from "@/utils/canvas.action";
import { Button } from "@/components/ui/button";
import { formBoxsAtom } from "@/atom/canvas.atom";
import { formAddInvoiceElement, getReadyForPrintAction, generateCsvFromReadyForPrint } from "@/utils/facture.action";
import { allowedLabelFieldsAtom, invoiceElementFinalRawAtom, invoiceIdAtom } from "@/atom/facture.atom";
import PrintDataModal from "../PrintDataModal/PrintDataModal";
import { Table, Check, Save, Trash2 } from "lucide-react";

// Interface pour LabelField (correspond à la structure de labelFields.json)
export interface LabelField {
    typeTextExtract: string | null;
    label: string;
    couleurDefaut: string;
    description: string;
    isAllowed?: boolean;
}

// Composant principal
export default function FormCanvasListDynamique() {
    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
    const [allowedLabelFields] = useAtom(allowedLabelFieldsAtom);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [invoiceElementFinalRaw, setinvoceElementFinalRaw] = useAtom(invoiceElementFinalRawAtom);

    const [modalState, modalAction, isModalPending] = useActionState(getReadyForPrintAction, {
        success: false,
        error: null,
        message: "",
        data: [],
    });
    const [printState, printAction, isPrintPending] = useActionState(generateCsvFromReadyForPrint, {
        success: false,
        error: null,
        message: "",
        data: [],
    });

    useEffect(() => {
        if (modalState.success && modalState.data.length > 0) {
            setIsModalOpen(true);
        }
    }, [modalState]);

    useEffect(() => {
        if (printState.success && printState.message) {
            const link = document.createElement("a");
            link.href = printState.message;
            link.download = `factures-${Date.now()}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
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

    const handleClickPrint = () => {
        const formData = new FormData();
        formData.append("userId", "2");
        formData.append("firmAccountingId", "1");
        printAction(formData);
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

    // Filtrer les formBoxs pour n'afficher que ceux dont le typeTextExtract est dans allowedLabelFields
    const filteredFormBoxs = formBoxs.filter((formBox) => {
        const selectedLabelField = formBox.selectedLabelField;
        if (!selectedLabelField || !selectedLabelField.typeTextExtract) return false;
        return allowedLabelFields.some(
            (field) => field.typeTextExtract === selectedLabelField.typeTextExtract
        );
    });

    return (
        <div className="p-4 bg-[#E6F2E1] border-l border-[#B8D8BA] h-[calc(100vh-80px)] overflow-y-auto shadow-sm flex flex-col">
            {/* Mini-header sticky au-dessus avec hauteur réduite */}
            <div className="sticky top-0 z-10 flex items-center justify-between bg-[#E6F2E1] border-b border-[#B8D8BA] py-1.5">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-[#2C5530] hidden sm:block">Formulaire</h3>
                    <Button
                        type="submit"
                        form="dataForm"
                        className="px-3 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200 min-w-[40px] sm:min-w-[140px]"
                        disabled={isModalPending}
                    >
                        <Table size={16} className="mr-1 sm:mr-1" />
                        <span className="hidden sm:inline">{isModalPending ? "Chargement..." : "Consulter les datas"}</span>
                    </Button>
                    <Button
                        onClick={handleClickPrint}
                        disabled={isPrintPending}
                        className="px-3 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200 min-w-[40px] sm:min-w-[120px]"
                    >
                        <Save size={16} className="mr-1 sm:mr-1" />
                        <span className="hidden sm:inline">{isPrintPending ? "Chargement..." : "Télécharger CSV"}</span>
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        type="button"
                        onClick={clearCardList}
                        className="px-3 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200 min-w-[40px] sm:min-w-[100px]"
                    >
                        <Trash2 size={16} className="mr-1 sm:mr-1" />
                        <span className="hidden sm:inline">Vider tout</span>
                    </Button>
                    {formBoxs.length > 0 && (
                        <Button
                            type="submit"
                            form="submitForm"
                            className="px-3 py-1.5 text-sm rounded-full bg-[#7FB069] text-white border border-[#7FB069] hover:bg-[#6CA052] transition-all duration-200 min-w-[40px] sm:min-w-[160px]"
                            disabled={isPending}
                        >
                            <Check size={16} className="mr-1" />
                            <span className="sm:inline">{isPending ? "Validation..." : "Valider"}</span>
                        </Button>
                    )}
                </div>
            </div>

            <form id="dataForm" action={modalAction} className="hidden">
                <input type="hidden" name="firmAccountingId" defaultValue="1" required />
                <input type="hidden" name="userId" defaultValue="2" />
            </form>

            <form id="submitForm" action={formAction} className="hidden">
                <input type="hidden" name="invoiceId" value={invoiceId ? String(invoiceId) : ""} />
                <input type="hidden" name="formBoxs" value={JSON.stringify(formBoxs)} />
            </form>

            {/* Contenu principal avec espace maximisé pour la liste */}
            <div className="flex flex-col  flex-grow overflow-y-auto mt-2">
                {filteredFormBoxs.length === 0 ? (
                    <p className="text-sm text-[#2C5530] opacity-70">
                        Aucun champ pour l'instant. Ajoutez-en un pour commencer.
                    </p>
                ) : (
                    filteredFormBoxs.map((element) => (
                        <FormCardInputDynamique key={element.id} {...element} />
                    ))
                )}
            </div>

            {/* Messages d'erreur et modale */}
            {state?.message && <p className="mt-2 text-sm text-red-600">{state.message}</p>}
            {modalState.error && (
                <p className="mt-2 text-sm text-red-600">Erreur : {modalState.error}</p>
            )}
            {modalState.success && modalState.message && modalState.data.length === 0 && (
                <p className="mt-2 text-sm text-[#2C5530] opacity-70">{modalState.message}</p>
            )}
            {printState.error && (
                <p className="mt-2 text-sm text-red-600">Erreur : {printState.error}</p>
            )}
            {printState.success && printState.data.length === 0 && !printState.message && (
                <p className="mt-2 text-sm text-[#2C5530] opacity-70">
                    Aucune facture trouvée pour cette société comptable.
                </p>
            )}
            {isModalOpen && <PrintDataModal data={modalState.data} onClose={closeModal} />}
        </div>
    );
}