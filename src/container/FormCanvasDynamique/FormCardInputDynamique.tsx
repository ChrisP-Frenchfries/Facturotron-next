"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import React, { useMemo } from "react";
import { atom, useAtom, useAtomValue } from "jotai";
import { cn } from "@/lib/utils";
import { BoundingBox, InvoiceElement } from "@/utils/canvas.action";
import { formBoxsAtom } from "@/atom/canvas.atom";


// Factory pour créer des atoms dynamiques avec typage générique
const createDynamicAtom = <T,>(id: string, initialValue: T) => atom<T>(initialValue);

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
    const labelTypeAtom = useMemo(
        () => createDynamicAtom<string>(`${id}-labelType`, "Text"),
        [id]
    );

    // Utilisation des atoms avec useAtom
    const [currentBoundingBox] = useAtom(boundingBoxAtom);
    const [inputValue, setInputValue] = useAtom(inputValueAtom);
    const [labelType, setLabelType] = useAtom(labelTypeAtom);

    // Gestion des changements
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleLabelTypeChange = (value: string) => {
        setLabelType(value);
    };

    return (
        <Card className={cn("p-4 w-full max-w-md")}>
            <div className="space-y-4">
                {/* Combobox pour le type */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`label-type-${id}`}>Type de champ</Label>
                    <Select value={labelType} onValueChange={handleLabelTypeChange}>
                        <SelectTrigger id={`label-type-${id}`} className="w-full">
                            <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Text">Texte</SelectItem>
                            <SelectItem value="Number">Nombre</SelectItem>
                            <SelectItem value="Date">Date</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Input pour la valeur */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor={`input-${id}`}>Valeur (extrait des blocks)</Label>
                    <Input
                        id={`input-${id}`}
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Entrez ou modifiez la valeur"
                        className="w-full"
                    />
                </div>

                {/* Infos BoundingBox */}
                <div className="text-sm text-muted-foreground">
                    <p>
                        BoundingBox: Top: {currentBoundingBox.Top}, Left: {currentBoundingBox.Left}
                    </p>
                    <p>ID: {id}</p>
                </div>
            </div>
        </Card>
    );
}