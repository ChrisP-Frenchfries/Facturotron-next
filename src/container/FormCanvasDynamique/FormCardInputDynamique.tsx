"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useMemo, useEffect } from "react";
import { atom, useAtom } from "jotai";
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
  inputValue: initialInputValue, // Récupérer inputValue des props
  selectedLabelField: initialSelectedLabelField, // Récupérer selectedLabelField des props
}: InvoiceElement) {
  const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
  const currentElement = formBoxs.find((element) => element.id === id);

  // Utiliser inputValue des props comme valeur initiale, avec fallback sur blocks si nécessaire
  const initialTextValue = initialInputValue ?? blocks?.[0]?.Text ?? "";

  // Créer les atomes localement
  const boundingBoxAtom = useMemo(
    () => createDynamicAtom<BoundingBox>(`${id}-boundingBox`, boundingBox),
    [id, boundingBox]
  );

  const inputValueAtom = useMemo(
    () => createDynamicAtom<string>(`${id}-inputValue`, initialTextValue),
    [id, initialTextValue]
  );

  const selectedLabelFieldAtom = useMemo(
    () =>
      createDynamicAtom<LabelField | null>(
        `${id}-selectedLabelField`,
        initialSelectedLabelField ?? null
      ),
    [id, initialSelectedLabelField]
  );

  const [currentBoundingBox] = useAtom(boundingBoxAtom);
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [selectedLabelField, setSelectedLabelField] = useAtom(
    selectedLabelFieldAtom
  );

  console.log("currentBoundingBox:", currentBoundingBox);
  console.log("inputValue:", inputValue);
  console.log("selectedLabelField:", selectedLabelField);

  // Synchroniser avec formBoxsAtom uniquement si les valeurs ont changé
  useEffect(() => {
    setFormBoxs((prev) =>
      prev.map((element) =>
        element.id === id &&
          (element.inputValue !== inputValue ||
            element.selectedLabelField !== selectedLabelField)
          ? { ...element, inputValue, selectedLabelField }
          : element
      )
    );
  }, [id, inputValue, selectedLabelField, setFormBoxs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <Card
      className={cn(
        `p-4 w-full max-w-md ${selectedLabelField?.couleurDefaut || ""}`
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-col gap-2">
          <LabelFieldSelector atom={selectedLabelFieldAtom} />
        </div>
        <div className="flex flex-col gap-2">
          <Input
            id={`input-${id}`}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Entrez ou modifiez la valeur"
            className="w-full font-medium bg-white"
          />
        </div>
      </div>
    </Card>
  );
}