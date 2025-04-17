"use client";

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
  inputValue: initialInputValue,
  selectedLabelField: initialSelectedLabelField,
}: InvoiceElement) {
  const [formBoxs, setFormBoxs] = useAtom(formBoxsAtom);
  const currentElement = formBoxs.find((element) => element.id === id);

  const initialTextValue = initialInputValue ?? blocks?.[0]?.Text ?? "";

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
    <div className="flex flex-row items-center gap- max-w-md border-b border-[#B8D8BA] py-2">
      <div
        className={cn(
          "h-4 w-4",
          selectedLabelField?.couleurDefaut || "bg-gray-200"
        )}
      ></div>
      <LabelFieldSelector atom={selectedLabelFieldAtom} />
      <div className="border-r border-[#B8D8BA] h-6"></div>
      <Input
        id={`input-${id}`}
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Entrez ou modifiez la valeur"
        className={cn(
          "w-full font-medium border-none shadow-none",
          selectedLabelField?.couleurDefaut
            ? `bg-[${selectedLabelField.couleurDefaut}] bg-opacity-20`
            : "bg-white"
        )}
        style={{
          color: selectedLabelField?.couleurDefaut || "inherit",
        }}
      />
    </div>
  );
}