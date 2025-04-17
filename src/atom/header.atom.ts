import { InvoiceElement } from "@/utils/canvas.action";
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils";



export const trigerSoumettreBoites = atom<boolean>(false);

export const selectedClientAtom = atomWithStorage<string>('selectedClient', '');
export const isSmartDetectAtom = atomWithStorage<string>('isSmartDetect', '');  
