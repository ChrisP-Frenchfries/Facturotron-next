"use client";

import { useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import labelFields from "../../data/labelFields.json";

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

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Filtrer les champs</SheetTitle>
                    <SheetClose />
                </SheetHeader>
                <div className="mt-6 space-y-4">
                    {/* Boutons pour cocher/décocher tout */}
                    <div className="flex space-x-2">
                        <Button
                            onClick={checkAll}
                            className="bg-green-500 hover:bg-green-600"
                        >
                            Tout cocher
                        </Button>
                        <Button
                            onClick={uncheckAll}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Tout décocher
                        </Button>
                    </div>
                    {/* Liste des LabelField */}
                    <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {labelFields.map((field) => (
                            <div
                                key={field.typeTextExtract}
                                className="flex items-center space-x-3"
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
                                    className="w-5 h-5"
                                />
                                {/* Label */}
                                <label
                                    htmlFor={field.typeTextExtract || field.label}
                                    className="flex-1 text-sm font-medium"
                                >
                                    {field.label}
                                </label>
                                {/* Div carrée colorée */}
                                <div
                                    className={`w-5 h-5 ${field.couleurDefaut} rounded-sm`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}