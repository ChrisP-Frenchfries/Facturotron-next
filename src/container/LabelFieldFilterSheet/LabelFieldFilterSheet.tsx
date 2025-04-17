"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import labelFields from "../../data/labelFields.json";
import { CheckSquare, Square, Filter, X, Check } from "lucide-react";

// Interface pour LabelField
export interface LabelField {
    typeTextExtract: string | null;
    label: string;
    couleurDefaut: string;
    description: string;
    isAllowed?: boolean;
}

// Atome pour contrôler l'ouverture de la sheet
export const filterOpenAtom = atomWithStorage<boolean>("filterOpen", false);

// Atome pour les LabelField filtrés (contient tous les LabelField avec isAllowed)
export const filteredLabelField = atomWithStorage<LabelField[]>(
    "filteredLabelField",
    labelFields
);

// Composant Sheet pour filtrer les LabelField
export default function LabelFieldFilterSheet() {
    const [isOpen, setIsOpen] = useAtom(filterOpenAtom);
    const [labelFields, setLabelFields] = useAtom(filteredLabelField);

    // Gérer le changement d'état d'une checkbox
    const handleCheckboxChange = (typeTextExtract: string, checked: boolean) => {
        setLabelFields((prev) =>
            prev.map((field) =>
                field.typeTextExtract === typeTextExtract
                    ? { ...field, isAllowed: checked }
                    : field
            )
        );
    };

    // Cocher toutes les checkboxes
    const checkAll = () => {
        setLabelFields((prev) =>
            prev.map((field) => ({ ...field, isAllowed: true }))
        );
    };

    // Décocher toutes les checkboxes
    const uncheckAll = () => {
        setLabelFields((prev) =>
            prev.map((field) => ({ ...field, isAllowed: false }))
        );
    };

    // Fermer le sheet (pour le bouton Appliquer)
    const closeSheet = () => {
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-[400px] sm:w-[540px] bg-[#E6F2E1]/95 backdrop-blur-sm border-r border-[#B8D8BA] p-0">
                <div className="flex flex-col h-full">
                    <SheetHeader className="bg-[#E6F2E1] border-b border-[#B8D8BA] p-4">
                        <div className="flex items-center">
                            <div className="bg-[#7FB069]/90 h-10 w-10 rounded-full flex items-center justify-center mr-3 shadow-sm">
                                <Filter size={20} className="text-white" />
                            </div>
                            <SheetTitle className="text-[#2C5530] font-semibold text-lg">Filtrer les champs</SheetTitle>
                        </div>
                        <SheetClose className="absolute right-4 top-4 rounded-full p-1 hover:bg-[#B8D8BA]/30">
                            <X size={20} className="text-[#2C5530]" />
                        </SheetClose>
                    </SheetHeader>

                    <div className="flex-1 overflow-hidden flex flex-col p-5">
                        {/* Boutons pour cocher/décocher tout */}
                        <div className="flex space-x-3 mb-5">
                            <button
                                onClick={checkAll}
                                className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
                            >
                                <CheckSquare size={16} />
                                <span>Tout cocher</span>
                            </button>
                            <button
                                onClick={uncheckAll}
                                className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
                            >
                                <Square size={16} />
                                <span>Tout décocher</span>
                            </button>
                        </div>

                        {/* Liste des LabelField */}
                        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                            {labelFields.map((field) => (
                                <div
                                    key={field.typeTextExtract}
                                    className="flex items-center space-x-3 pl-2 py-2 hover:bg-[#B8D8BA]/20 rounded-lg transition-colors"
                                >
                                    {/* Checkbox */}
                                    <Checkbox
                                        id={field.typeTextExtract || field.label}
                                        checked={field.isAllowed ?? false}
                                        onCheckedChange={(checked) =>
                                            handleCheckboxChange(
                                                field.typeTextExtract || "",
                                                checked as boolean
                                            )
                                        }
                                        className="w-5 h-5 border-[#7FB069] data-[state=checked]:bg-[#7FB069] data-[state=checked]:text-white"
                                    />
                                    {/* Label */}
                                    <label
                                        htmlFor={field.typeTextExtract || field.label}
                                        className="flex-1 text-sm font-medium text-[#2C5530] cursor-pointer"
                                    >
                                        {field.label}
                                    </label>
                                    {/* Div carrée colorée */}
                                    <div
                                        className={`w-5 h-5 ${field.couleurDefaut} rounded-sm shadow-sm`}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Bouton Appliquer les filtres */}
                        <div className="mt-5 pt-4 border-t border-[#B8D8BA] flex justify-end">
                            <button
                                onClick={closeSheet}
                                className="flex items-center gap-2 px-6 py-2 text-sm rounded-full bg-[#7FB069] text-white border border-[#7FB069] hover:bg-[#6A9A57] transition-all duration-200 shadow-sm"
                            >
                                <Check size={16} />
                                <span>Appliquer les filtres</span>
                            </button>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}