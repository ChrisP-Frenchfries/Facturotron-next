import { atom } from "jotai"




export const invoiceIdAtom = atom<string>('');
export const pathFileAtom = atom<string>('');

export const invoiceQueueAtom = atom([])
