import { atom } from "jotai"
import { atomWithStorage } from 'jotai/utils';

// Atom avec persistance dans localStorage
export const invoiceIdAtom = atomWithStorage<number | null>('invoiceId', 14); // Clé 'invoiceId' dans localStorage
export const pathFileAtom = atomWithStorage<string>('pathFile', '');   // Clé 'pathFile' dans localStorage


export const invoiceQueueAtom = atom([])


