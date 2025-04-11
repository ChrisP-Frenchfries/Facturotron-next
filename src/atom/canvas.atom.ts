import { InvoiceElement } from "@/utils/canvas.action";
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils";


export const formBoxsAtom = atomWithStorage<InvoiceElement[]>('formBoxs', [])

export interface BoundingBox {
    Top: number;
    Left: number;
    Width: number;
    Height: number;
}

// Atome pour boundingBoxes
export const boundingBoxesAtom = atom<BoundingBox[]>([]);