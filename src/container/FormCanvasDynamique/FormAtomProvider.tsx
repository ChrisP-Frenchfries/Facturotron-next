import { Atom } from "jotai";
import { createContext, useContext, useMemo } from 'react';

const AtomContext = createContext<Map<string, Atom<any>>>(new Map());

export default function FormAtomProvider({ children }: { children: React.ReactNode }) {
    const atomMap = useMemo(() => new Map<string, Atom<any>>(), []);
    return <AtomContext.Provider value={atomMap}>{children}</AtomContext.Provider>;
}

export const useAtomMap = () => useContext(AtomContext);

