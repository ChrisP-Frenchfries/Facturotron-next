"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { selectedClientAtom, isSmartDetectAtom } from "@/atom/header.atom";
import { uploadDocument } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useActionState, useEffect } from "react";
import { Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Simulation d'une session
const getSessionUserId = () => "2";

export default function UploadForm() {
    const [pathFile, setPathFile] = useAtom(pathFileAtom);
    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [selectedClient, setSelectedClient] = useAtom(selectedClientAtom);
    const [isSmartDetect, setIsSmartDetect] = useAtom(isSmartDetectAtom);

    const userId = getSessionUserId();
    const [state, formAction, isPending] = useActionState(uploadDocument, { message: null });

    useEffect(() => {
        if (state.filePath) {
            setPathFile(state.filePath);
        }
        if (state.invoiceId) {
            setInvoiceId(state.invoiceId);
        }
    }, [state, setPathFile, setInvoiceId]);

    const handleClientChange = (e) => {
        setSelectedClient(e.target.value);
    };

    const handleSmartDetectChange = (e) => {
        setIsSmartDetect(e.target.checked ? "true" : "false");
    };

    // Animation variants
    const formVariants = {
        hidden: {
            opacity: 0,
            height: 0,
            transition: {
                duration: 0.4,
                ease: [0.04, 0.62, 0.23, 0.98] // Courbe d'animation plus naturelle
            }
        },
        visible: {
            opacity: 1,
            height: "auto",
            transition: {
                duration: 0.4,
                ease: [0.04, 0.62, 0.23, 0.98]
            }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={formVariants}
            className="w-full overflow-hidden"
        >
            <div className="bg-[#E6F2E1]/90 backdrop-blur-sm border-b border-[#B8D8BA] px-4 py-3">
                <form action={formAction} className="flex flex-wrap items-center gap-3">
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="isSmartDetect" value={isSmartDetect} />

                    <div className="flex items-center flex-1 min-w-[200px]">
                        <select
                            id="clientId"
                            name="clientId"
                            value={selectedClient}
                            onChange={handleClientChange}
                            className="bg-white/90 text-[#2C5530] border border-[#B8D8BA] rounded-full px-3 py-1.5 outline-none transition-all duration-300 focus:ring-1 focus:ring-[#9BC995] hover:border-[#9BC995] appearance-none bg-no-repeat bg-right-10-center flex-1 disabled:opacity-70 text-sm"
                            style={{
                                backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232C5530' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                backgroundSize: "16px",
                                paddingRight: "32px"
                            }}
                            disabled={isPending}
                            required
                        >
                            <option value="">Sélectionnez un client</option>
                            <option value="1">client test</option>
                            <option value="client2">bientot</option>
                            <option value="client3">faire un map</option>
                        </select>
                    </div>

                    <div className="flex items-center flex-1 min-w-[200px]">
                        <input
                            type="file"
                            id="document"
                            name="document"
                            accept=".pdf,image/*"
                            className="bg-white/90 text-[#2C5530] border border-[#B8D8BA] rounded-full px-3 py-1.5 w-full cursor-pointer outline-none transition-all duration-300 focus:ring-1 focus:ring-[#9BC995] hover:border-[#9BC995] disabled:opacity-70 text-sm"
                            disabled={isPending}
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <label htmlFor="smartDetect" className="text-[#2C5530] mr-2 inline-flex items-center text-sm">
                            <Zap size={14} className="mr-1 text-[#7FB069]" />
                            <span>Smart Detection</span>
                        </label>
                        <input
                            type="checkbox"
                            id="smartDetect"
                            checked={isSmartDetect === "true"}
                            onChange={handleSmartDetectChange}
                            className="w-4 h-4 accent-[#7FB069] cursor-pointer"
                            disabled={isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-[#7FB069] text-white rounded-full px-5 py-1.5 text-sm font-medium shadow-sm transition-all duration-300 outline-none disabled:opacity-70 disabled:cursor-not-allowed hover:bg-[#6A9A57] hover:shadow-md"
                        disabled={isPending}
                    >
                        {isPending ? "Envoi..." : "Envoyer"}
                    </button>

                    {state.message && (
                        <div className={`ml-3 py-1 px-3 rounded-full text-sm font-medium ${state.message.includes("Erreur")
                                ? "bg-red-100/80 text-red-600"
                                : "bg-[#9BC995]/80 text-[#2C5530]"
                            }`}>
                            {state.message}
                        </div>
                    )}
                </form>
            </div>
        </motion.div>
    );
}