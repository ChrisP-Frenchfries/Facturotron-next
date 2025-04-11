// components/LabelFieldSelector.tsx
"use client";

import labelFields from "../../data/labelFields.json";
import { useState } from "react";
import { useAtom } from "jotai";
import { PrimitiveAtom } from "jotai"; // Importer PrimitiveAtom

// Définir l'interface pour les objets du JSON
export interface LabelField {
    typeTextExtract: string | null;
    label: string;
    couleurDefaut: string;
    description: string;
}

// Props pour le composant
interface LabelFieldSelectorProps {
    atom: PrimitiveAtom<LabelField | null>; // Utiliser PrimitiveAtom au lieu de Atom
}

// Composant principal
export default function LabelFieldSelector({ atom }: LabelFieldSelectorProps) {
    const [selectedField, setSelectedField] = useAtom(atom);
    const [value, setValue] = useState("");

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedLabel = event.target.value;
        const foundField = labelFields.find((field) => field.label === selectedLabel) || null;
        setSelectedField(foundField);
        setValue(selectedLabel);
    };

    return (
        <div className="w-full">
            <select
                id="field-selector"
                value={value}
                onChange={handleSelectChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2"
            >
                <option value="">-- Choisir un champ --</option>
                {labelFields.map((field) => (
                    <option key={field.label} value={field.label}>
                        {field.label}
                    </option>
                ))}
            </select>

            {/* Affichage de l'objet sélectionné pour démo */}
            {selectedField && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium text-gray-900">Champ sélectionné :</h3>
                    <pre className="mt-2 text-sm text-gray-600">
                        {JSON.stringify(selectedField, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}