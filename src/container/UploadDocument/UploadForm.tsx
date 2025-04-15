"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { uploadDocument } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useActionState, useEffect, useState } from "react";

// Simulation d'une session (remplacez par votre système d'authentification)
const getSessionUserId = () => "2"; // Exemple statique, à adapter

export default function UploadForm() {
    const [pathFile, setPathFile] = useAtom(pathFileAtom);
    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [isSmartDetect, setIsSmartDetect] = useState(false); // État pour Smart Detection

    const userId = getSessionUserId(); // Récupérer l'userId depuis la session
    const [state, formAction, isPending] = useActionState(uploadDocument, { message: null });

    useEffect(() => {
        if (state.filePath) {
            setPathFile(state.filePath); // Met à jour l'atome avec le filePath retourné
        }
    }, [state.filePath, setPathFile]);

    useEffect(() => {
        if (state.invoiceId) {
            setInvoiceId(state.invoiceId); // Met à jour l'atome avec l'invoiceId retourné
        }
    }, [state.invoiceId, setInvoiceId]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Uploader un document</h1>
            <form action={formAction} className="space-y-4">
                {/* Champ caché pour userId */}
                <input type="hidden" name="userId" value={userId} />

                {/* Champ caché pour isSmartDetect */}
                <input type="hidden" name="isSmartDetect" value={isSmartDetect.toString()} />

                {/* Sélection du clientId */}
                <div>
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                        Client
                    </label>
                    <select
                        id="clientId"
                        name="clientId"
                        className="mt-1 block w-1/4 border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={isPending}
                        required
                    >
                        <option value="">Sélectionnez un client</option>
                        <option value="1">client test</option>
                        <option value="client2">bientot</option>
                        <option value="client3">faire un map</option>
                    </select>
                </div>

                {/* Upload du fichier */}
                <div>
                    <label htmlFor="document" className="block text-sm font-medium text-gray-700">
                        Document (PDF ou Image)
                    </label>
                    <input
                        type="file"
                        id="document"
                        name="document"
                        accept=".pdf,image/*"
                        className="mt-1 block w-1/4 border border-gray-300 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        disabled={isPending}
                        required
                    />
                </div>

                {/* Toggle pour Smart Detection */}
                <div className="flex items-center">
                    <label htmlFor="smartDetect" className="mr-3 text-sm font-medium text-gray-700">
                        Smart Detection (AnalyzeExpense)
                    </label>
                    <div className="relative inline-block w-10 h-6">
                        <input
                            type="checkbox"
                            id="smartDetect"
                            checked={isSmartDetect}
                            onChange={(e) => setIsSmartDetect(e.target.checked)}
                            className="peer appearance-none w-full h-full rounded-full bg-gray-300 checked:bg-blue-600 transition-colors duration-200"
                            disabled={isPending}
                        />
                        <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 peer-checked:translate-x-4" />
                    </div>
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={isPending}
                >
                    {isPending ? "Envoi..." : "Envoyer"}
                </button>
            </form>

            {/* Affichage du feedback */}
            {state.message && (
                <p className={`mt-4 ${state.message.includes("Erreur") ? "text-red-500" : "text-green-500"}`}>
                    {state.message}
                </p>
            )}
        </div>
    );
}