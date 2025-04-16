"use client";

import { invoiceIdAtom, pathFileAtom } from "@/atom/facture.atom";
import { uploadDocument } from "@/utils/facture.action";
import { useAtom } from "jotai";
import { useActionState, useEffect, useState } from "react";
import { Upload, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Palette de couleurs zen
const zenColors = {
    primary: "#7FB069",       // Vert clair principal
    secondary: "#E6F2E1",     // Vert très clair (fond)
    accent: "#5C8D56",        // Vert plus foncé pour contraste
    text: "#2C5530",          // Vert foncé pour texte
    border: "#B8D8BA",        // Vert clair pour bordures
    hover: "#9BC995",         // Vert clair pour hover
};

// Simulation d'une session (remplacez par votre système d'authentification)
const getSessionUserId = () => "2"; // Exemple statique, à adapter

export default function UploadForm() {
    const [pathFile, setPathFile] = useAtom(pathFileAtom);
    const [invoiceId, setInvoiceId] = useAtom(invoiceIdAtom);
    const [isSmartDetect, setIsSmartDetect] = useState(false); // État pour Smart Detection
    const [isVisible, setIsVisible] = useState(false); // État pour l'animation

    const userId = getSessionUserId(); // Récupérer l'userId depuis la session
    const [state, formAction, isPending] = useActionState(uploadDocument, { message: null });

    useEffect(() => {
        // Effet de déroulement
        setIsVisible(true);

        if (state.filePath) {
            setPathFile(state.filePath); // Met à jour l'atome avec le filePath retourné
        }
    }, [state.filePath, setPathFile]);

    useEffect(() => {
        if (state.invoiceId) {
            setInvoiceId(state.invoiceId); // Met à jour l'atome avec l'invoiceId retourné
        }
    }, [state.invoiceId, setInvoiceId]);

    // Styles personnalisés pour les inputs zen
    const zenInputStyle = {
        backgroundColor: "white",
        color: zenColors.text,
        border: `1px solid ${zenColors.border}`,
        borderRadius: "8px",
        padding: "8px 12px",
        outline: "none",
        transition: "all 0.2s ease",
    };

    const zenLabelStyle = {
        color: zenColors.text,
        fontWeight: "600",
        marginRight: "12px",
        minWidth: "120px",
        display: "inline-block",
    };

    const zenButtonStyle = {
        backgroundColor: zenColors.primary,
        color: "white",
        border: "none",
        borderRadius: "20px",
        padding: "10px 24px",
        fontWeight: "600",
        cursor: "pointer",
        transition: "all 0.2s ease",
        outline: "none",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    };

    return (
        <motion.div
            initial={{ opacity: 0, height: 0, overflow: "hidden" }}
            animate={{
                opacity: isVisible ? 1 : 0,
                height: isVisible ? "auto" : 0,
                marginTop: isVisible ? "20px" : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            style={{
                backgroundColor: zenColors.secondary,
                borderRadius: "12px",
                padding: "20px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                margin: "0 auto",
                maxWidth: "100%",
                overflow: "hidden",
                border: `1px solid ${zenColors.border}`
            }}
        >
            <div style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                borderBottom: `1px solid ${zenColors.border}`,
                paddingBottom: "12px"
            }}>
                <div style={{
                    backgroundColor: zenColors.primary,
                    height: "36px",
                    width: "36px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}>
                    <Upload size={18} color="white" />
                </div>
                <h2 style={{
                    color: zenColors.text,
                    fontWeight: "600",
                    fontSize: "18px",
                    margin: 0
                }}>
                    Uploader un document
                </h2>
            </div>

            <form action={formAction} style={{ width: "100%" }}>
                {/* Champs cachés */}
                <input type="hidden" name="userId" value={userId} />
                <input type="hidden" name="isSmartDetect" value={isSmartDetect.toString()} />

                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
                    {/* Sélection du clientId */}
                    <div style={{ display: "flex", alignItems: "center", flex: "1 1 300px" }}>
                        <label htmlFor="clientId" style={zenLabelStyle}>
                            Client
                        </label>
                        <select
                            id="clientId"
                            name="clientId"
                            style={{
                                ...zenInputStyle,
                                flex: 1,
                                appearance: "none",
                                backgroundImage: "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232C5530' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right 10px center",
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

                    {/* Upload du fichier */}
                    <div style={{ display: "flex", alignItems: "center", flex: "1 1 300px" }}>
                        <label htmlFor="document" style={zenLabelStyle}>
                            Document
                        </label>
                        <div style={{ flex: 1, position: "relative" }}>
                            <input
                                type="file"
                                id="document"
                                name="document"
                                accept=".pdf,image/*"
                                style={{
                                    ...zenInputStyle,
                                    width: "100%",
                                    padding: "8px",
                                    cursor: "pointer",
                                    color: zenColors.text
                                }}
                                disabled={isPending}
                                required
                            />
                        </div>
                    </div>

                    {/* Checkbox pour Smart Detection */}
                    <div style={{ display: "flex", alignItems: "center", flex: "1 1 300px" }}>
                        <label htmlFor="smartDetect" style={zenLabelStyle}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <Zap size={16} style={{ marginRight: "6px", color: zenColors.accent }} />
                                <span>Smart Detection</span>
                            </div>
                        </label>
                        <input
                            type="checkbox"
                            id="smartDetect"
                            checked={isSmartDetect}
                            onChange={(e) => setIsSmartDetect(e.target.checked)}
                            style={{
                                width: "18px",
                                height: "18px",
                                accentColor: zenColors.primary,
                                cursor: "pointer"
                            }}
                            disabled={isPending}
                        />
                    </div>
                </div>

                {/* Bouton de soumission */}
                <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            ...zenButtonStyle,
                            opacity: isPending ? 0.7 : 1,
                            cursor: isPending ? "not-allowed" : "pointer"
                        }}
                        disabled={isPending}
                    >
                        {isPending ? "Envoi en cours..." : "Envoyer"}
                    </motion.button>
                </div>

                {/* Affichage du feedback */}
                {state.message && (
                    <div style={{
                        marginTop: "20px",
                        padding: "12px",
                        borderRadius: "8px",
                        backgroundColor: state.message.includes("Erreur") ? "#FFF2F2" : "#F2FFED",
                        color: state.message.includes("Erreur") ? "#D32F2F" : "#388E3C",
                        fontWeight: "500",
                        textAlign: "center"
                    }}>
                        {state.message}
                    </div>
                )}
            </form>
        </motion.div>
    );
}