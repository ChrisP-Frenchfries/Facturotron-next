"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { uploadDocument } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useActionState, useEffect } from "react";


// Simulation d'une session (remplacez par votre système d'authentification)
const getSessionUserId = () => "2"; // Exemple statique, à adapter

export default function UploadForm() {

    const [pathFile, setPathFile] = useAtom(pathFileAtom);
    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);



    const userId = getSessionUserId(); // Récupérer l'userId depuis la session
    const [state, formAction, isPending] = useActionState(uploadDocument, { message: null });

    useEffect(() => {
        if (state.filePath) {
            setPathFile(state.filePath); // Met à jour l'atome avec le filePath retourné
        }
    }, [state.filePath, setPathFile]);

    useEffect(() => {
        if (state.invoiceId) {
            setInvoiceId(state.invoiceId); // Met à jour l'atome avec le filePath retourné
        }
    }, [state.invoiceId, setInvoiceId]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Uploader un document</h1>
            <form action={formAction} className="space-y-4">
                {/* Champ caché pour userId */}
                <input type="hidden" name="userId" value={userId} />

                {/* Sélection du clientId */}
                <div>
                    <label htmlFor="clientId" className="block">Client</label>
                    <select
                        id="clientId"
                        name="clientId"
                        className="border p-2 w-1/4"
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
                    <label htmlFor="document" className="block">Document (PDF ou Image)</label>
                    <input
                        type="file"
                        id="document"
                        name="document"
                        accept=".pdf,image/*"
                        className="border p-2 w-1/4"
                        disabled={isPending}
                        required
                    />
                </div>

                {/* Bouton de soumission */}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
                    disabled={isPending}
                >
                    {isPending ? "Envoi..." : "Envoyer"}
                </button>
            </form>

            {/* Affichage du feedback */}
            {state.message && (
                <p className={state.message.includes("Erreur") ? "text-red-500" : "text-green-500"}>
                    {state.message}
                </p>
            )}
        </div>
    );
}