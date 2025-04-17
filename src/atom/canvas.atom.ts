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

//Atome panel
export const activeCanvasDrawingAtom = atom<boolean>(false);
export const activeInputValueAtom = atom<boolean>(false);

export const submitBoxesAtom = atom(
    null, // getter (pas utilisé ici)
    (get, set, callback) => {
        // Cette fonction sera appelée lors de la mise à jour de l'atome
        if (typeof callback === 'function') {
            callback();
        }
    }
);