import LabelFieldSelector, { LabelField } from "@/container/FormCanvasDynamique/LabelFieldSelector";
import { InvoiceElement } from "@/utils/canvas.action";
import { atom } from "jotai"
import { atomWithStorage } from 'jotai/utils';
import labelFields from "../data/labelFields.json"

// Atom avec persistance dans localStorage
export const invoiceIdAtom = atomWithStorage<number | null>('invoiceId', 14); // Clé 'invoiceId' dans localStorage
export const pathFileAtom = atomWithStorage<string>('pathFile', '');   // Clé 'pathFile' dans localStorage
export const invoiceElementFinalRawAtom = atomWithStorage<InvoiceElement[]>("invoiceElementFinalRaw", [])

export const filteredLabelField = atomWithStorage<LabelField[]>(
    'filteredLabelField', // Clé utilisée dans localStorage
    labelFields // Valeur initiale provenant du fichier JSON
);

//todo derivedAtom qui prenne seulement les labelfields true 

// Atome dérivé qui ne contient que les éléments avec isAllowed: true
export const allowedLabelFieldsAtom = atom((get) => {
    const fields = get(filteredLabelField);
    return fields.filter(field => field.isAllowed === true);
});

export const invoiceQueueAtom = atom([])


