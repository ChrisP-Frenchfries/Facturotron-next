import { InvoiceElement } from "@/utils/canvas.action";
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils";


export const formBoxsAtom = atomWithStorage<InvoiceElement[]>('formBoxs', [])