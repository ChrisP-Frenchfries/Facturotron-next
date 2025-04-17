"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai";
import labelFields from "../../data/labelFields.json";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

// Définir l'interface pour les objets du JSON
export interface LabelField {
    typeTextExtract: string | null;
    label: string;
    couleurDefaut: string;
    description: string;
    isAllowed?: boolean;
}

// Props pour le composant
interface LabelFieldSelectorProps {
    atom: PrimitiveAtom<LabelField | null>;
}

// Composant principal
export default function LabelFieldSelector({ atom }: LabelFieldSelectorProps) {
    const [selectedField, setSelectedField] = useAtom(atom);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(selectedField?.label || "");

    // Synchroniser value avec selectedField au montage et à chaque changement
    useEffect(() => {
        setValue(selectedField?.label || "");
    }, [selectedField]);

    const handleSelect = (currentValue: string) => {
        const selectedLabel = currentValue === value ? "" : currentValue;
        const foundField = labelFields.find((field) => field.label === selectedLabel) || null;
        setSelectedField(foundField);
        setValue(selectedLabel);
        setOpen(false);
    };

    // Filtrer les champs pour n'afficher que ceux avec isAllowed: true
    const allowedFields = labelFields.filter((field) => field.isAllowed === true);

    return (
        <div className="w-full">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between bg-transparent border-none text-[#2C5530] hover:bg-[#9BC995] transition-all duration-200 shadow-none"
                    >
                        {value ? value : "Sélectionner un champ..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                    <Command>
                        <CommandInput
                            placeholder="Rechercher un champ..."
                            className="h-9 border-none bg-transparent text-[#2C5530] placeholder:text-[#2C5530] placeholder:opacity-50 shadow-none"
                        />
                        <CommandList>
                            <CommandEmpty>Aucun champ trouvé.</CommandEmpty>
                            <CommandGroup>
                                {allowedFields.map((field) => (
                                    <CommandItem
                                        key={field.label}
                                        value={field.label}
                                        onSelect={handleSelect}
                                    >
                                        {field.label}
                                        <Check
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                value === field.label ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}