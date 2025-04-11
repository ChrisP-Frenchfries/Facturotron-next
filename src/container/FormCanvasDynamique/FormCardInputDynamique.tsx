"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useMemo, useEffect } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { cn } from "@/lib/utils";
import { BoundingBox, InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";
import LabelFieldSelector, { LabelField } from "./LabelFieldSelector";

const createDynamicAtom = <T,>(id: string, initialValue: T) =>
    atomWithStorage<T>(id, initialValue);

export default function FormCardInputDynamique({
    id,
    blocks,
    boundingBox,
    ...rest
}: InvoiceElement) {
    const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
    const currentElement = formBoxs.find((element) => element.id === id);
    const initialTextValue = blocks?.[0]?.Text || "";

    const boundingBoxAtom = useMemo(
        () => createDynamicAtom<BoundingBox>(`${id}-boundingBox`, boundingBox),
        [id, boundingBox]
    );
    const inputValueAtom = useMemo(
        () => createDynamicAtom<string>(`${id}-value`, initialTextValue),
        [id, initialTextValue]
    );
    const selectedLabelFieldAtom = useMemo(
        () => createDynamicAtom<LabelField | null>(`${id}-selectedLabelField`, null),
        [id]
    );

    const [currentBoundingBox] = useAtom(boundingBoxAtom);
    const [inputValue, setInputValue] = useAtom(inputValueAtom);
    const [selectedLabelField, setSelectedLabelField] = useAtom(selectedLabelFieldAtom);

    // Synchroniser avec formBoxsAtom
    useEffect(() => {
        setFormBoxs((prev) =>
            prev.map((element) =>
                element.id === id
                    ? { ...element, inputValue, selectedLabelField }
                    : element
            )
        );
    }, [id, inputValue, selectedLabelField, setFormBoxs]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    return (
        <Card className={cn(`p-4 w-full max-w-md ${selectedLabelField?.couleurDefaut}`)}>
            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`label-type-${id}`}>Type de champ</Label>
                    <LabelFieldSelector atom={selectedLabelFieldAtom} />
                </div>
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