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
import { useAtomMap } from "./FormAtomProvider"; // Importer useAtomMap

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

  // Accéder à la Map du contexte
  const atomMap = useAtomMap();

  // Créer les atomes dynamiques et les enregistrer dans le contexte
  const boundingBoxAtom = useMemo(() => {
    const atom = createDynamicAtom<BoundingBox>(`${id}-boundingBox`, boundingBox);
    atomMap.set(`${id}-boundingBox`, atom); // Enregistrer dans la Map
    return atom;
  }, [id, boundingBox, atomMap]);

  const inputValueAtom = useMemo(() => {
    const atom = createDynamicAtom<string>(`${id}-inputValue`, initialTextValue);
    atomMap.set(`${id}-inputValue`, atom); // Enregistrer dans la Map
    return atom;
  }, [id, initialTextValue, atomMap]);

  const selectedLabelFieldAtom = useMemo(() => {
    const atom = createDynamicAtom<LabelField | null>(
      `${id}-selectedLabelField`,
      null
    );
    atomMap.set(`${id}-selectedLabelField`, atom); // Enregistrer dans la Map
    return atom;
  }, [id, atomMap]);

  // Nettoyage des atomes lors du démontage 
  //atomMap.delete supprime chaque atome de la Map pour éviter les fuites de mémoire 
  // et garantir que les atomes obsolètes ne restent pas dans le contexte.
  useEffect(() => {
    return () => {
      atomMap.delete(`${id}-boundingBox`);
      atomMap.delete(`${id}-inputValue`);
      atomMap.delete(`${id}-selectedLabelField`);
    };
  }, [id, atomMap]);

  const [currentBoundingBox] = useAtom(boundingBoxAtom);
  const [inputValue, setInputValue] = useAtom(inputValueAtom);
  const [selectedLabelField, setSelectedLabelField] = useAtom(
    selectedLabelFieldAtom
  );

  console.log("currentBoundingBox:", currentBoundingBox);
  console.log("inputValue:", inputValue);
  console.log("selectedLabelField:", selectedLabelField);

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
    <Card
      className={cn(
        `p-4 w-full max-w-md ${selectedLabelField?.couleurDefaut}`
      )}
    >
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
            BoundingBox: Top: {currentBoundingBox.Top}, Left:{" "}
            {currentBoundingBox.Left}
          </p>
          <p>ID: {id}</p>
          {selectedLabelField && (
            <p>Champ sélectionné: {selectedLabelField.label}</p>
          )}
        </div>
      </div>
    </Card>
  );
}