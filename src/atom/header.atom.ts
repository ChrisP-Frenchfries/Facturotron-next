import { InvoiceElement } from "@/utils/canvas.action";
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils";



export const trigerSoumettreBoites = atom<boolean>(false);