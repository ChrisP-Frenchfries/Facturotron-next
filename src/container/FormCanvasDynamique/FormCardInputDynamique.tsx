// components/FormCardInputDynamique.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useMemo } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils"; // Importer atomWithStorage
import { cn } from "@/lib/utils";
import { BoundingBox, InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";
import LabelFieldSelector, { LabelField } from "./LabelFieldSelector";

// Factory pour créer des atoms dynamiques avec persistance
const createDynamicAtom = <T,>(id: string, initialValue: T) =>
    atomWithStorage<T>(id, initialValue);

export default function FormCardInputDynamique({
    id,
    blocks,
    boundingBox,
    ...rest
}: InvoiceElement) {
    // Récupérer les données globales de formBoxsAtom pour coordination
    const formBoxs = useAtomValue(formBoxsAtom);

    // Trouver l'élément correspondant dans formBoxsAtom (optionnel, pour synchronisation)
    const currentElement = formBoxs.find((element) => element.id === id);

    // Valeur initiale du texte depuis les blocks passés en props
    const initialTextValue = blocks?.[0]?.Text || "";

    // Création des atoms dynamiques avec useMemo
    const boundingBoxAtom = useMemo(
        () => createDynamicAtom<BoundingBox>(`${id}-boundingBox`, boundingBox),
        [id, boundingBox]
    );
    const inputValueAtom = useMemo(
        () => createDynamicAtom<string>(`${id}-value`, initialTextValue),
        [id, initialTextValue]
    );
    // Atome dynamique pour stocker l'objet LabelField sélectionné
    const selectedLabelFieldAtom = useMemo(
        () => createDynamicAtom<LabelField | null>(`${id}-selectedLabelField`, null),
        [id]
    );

    // Utilisation des atoms avec useAtom
    const [currentBoundingBox] = useAtom(boundingBoxAtom);
    const [inputValue, setInputValue] = useAtom(inputValueAtom);
    const [selectedLabelField, setSelectedLabelField] = useAtom(selectedLabelFieldAtom);

    // Gestion des changements pour l'input
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <Card className={cn(`p-4 w-full max-w-md ${selectedLabelField?.couleurDefaut} `)}>
            <div className="space-y-4">
                {/* Sélecteur pour le type de champ */}
                <div className="flex flex-col gap-2 ">
                    <Label htmlFor={`label-type-${id}`}>Type de champ</Label>
                    <LabelFieldSelector atom={selectedLabelFieldAtom} />
                </div>

                {/* Input pour la valeur */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`input-${id}`}>Valeur (extrait des blocks)</Label>
                    <Input
                        id={`input-${id}`}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Entrez ou modifiez la valeur"
                        className="w-full font-medium bg-white"
                    />
                </div>

                {/* Infos BoundingBox et sélection */}
                <div className="text-sm text-muted-foreground">
                    <p>
                        BoundingBox: Top: {currentBoundingBox.Top}, Left: {currentBoundingBox.Left}
                    </p>
                    <p>ID: {id}</p>
                    {selectedLabelField && <p>Champ sélectionné: {selectedLabelField.label}</p>}
                </div>
            </div>
        </Card>
    );
}