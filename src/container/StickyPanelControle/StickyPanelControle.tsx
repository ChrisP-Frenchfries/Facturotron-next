"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Filter, Upload, Pencil, Save, Eye, EyeOff, LogOut } from "lucide-react";
import LabelFieldFilterSheet, { filterOpenAtom } from "../LabelFieldFilterSheet/LabelFieldFilterSheet";
import UploadForm from "../UploadDocument/UploadForm";
import { activeCanvasDrawingAtom, activeInputValueAtom } from "@/atom/canvas.atom";
import { boundingBoxesAtom } from "@/atom/canvas.atom";
import { trigerSoumettreBoites } from "@/atom/header.atom";

// Palette de couleurs zen
const zenColors = {
  primary: "#7FB069",       // Vert clair principal
  secondary: "#E6F2E1",     // Vert très clair (fond)
  accent: "#5C8D56",        // Vert plus foncé pour contraste
  text: "#2C5530",          // Vert foncé pour texte
  border: "#B8D8BA",        // Vert clair pour bordures
  hover: "#9BC995",         // Vert clair pour hover
};

export default function StickyPanel() {
  const [, setFilterOpen] = useAtom(filterOpenAtom);
  const [showUpload, setShowUpload] = useState(false);
  const [isActiveDrawing, setIsActiveDrawing] = useAtom(activeCanvasDrawingAtom);
  const [showInputValue, setShowInputValue] = useAtom(activeInputValueAtom);
  const [boundingBoxes] = useAtom(boundingBoxesAtom);
  const router = useRouter();

  const handleNewDrawing = () => {
    setIsActiveDrawing(!isActiveDrawing);
  };

  const handleShowInputValue = () => {
    setShowInputValue(!showInputValue);
  };

  const [trigerSoumettre, setTrigerSoumettre] = useAtom(trigerSoumettreBoites);

  const handleTrigerAtom = () => {
    setTrigerSoumettre(!trigerSoumettre);
  };

  const handleLogout = () => {
    // Rediriger vers la racine
    router.push('/');
  };

  // Styles personnalisés pour les boutons zen
  const zenButtonStyle = (isActive) => ({
    backgroundColor: isActive ? zenColors.primary : "transparent",
    color: isActive ? "white" : zenColors.text,
    border: `1px solid ${isActive ? zenColors.primary : zenColors.border}`,
    borderRadius: "20px",
    padding: "6px 16px",
    fontSize: "14px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s ease",
    cursor: "pointer",
    outline: "none",
  });

  return (
    <>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        backgroundColor: zenColors.secondary,
        borderBottom: `1px solid ${zenColors.border}`,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
          padding: "0 16px"
        }}>
          {/* Boutons à gauche */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Bouton Dessiner */}
            <button
              onClick={handleNewDrawing}
              style={zenButtonStyle(isActiveDrawing)}
              onMouseEnter={(e) => {
                if (!isActiveDrawing) e.currentTarget.style.backgroundColor = zenColors.hover;
              }}
              onMouseLeave={(e) => {
                if (!isActiveDrawing) e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <Pencil size={16} />
              <span>{isActiveDrawing ? "Arrêter dessin" : "Dessiner"}</span>
            </button>

            {/* Bouton Soumettre - visible uniquement quand le dessin est actif */}
            {isActiveDrawing && (
              <button
                onClick={handleTrigerAtom}
                style={zenButtonStyle(false)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = zenColors.hover}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                <Save size={16} />
                <span>Soumettre les boîtes</span>
              </button>
            )}

            {/* Bouton Afficher/Masquer valeurs */}
            <button
              onClick={handleShowInputValue}
              style={zenButtonStyle(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = zenColors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {showInputValue ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showInputValue ? "Masquer valeurs" : "Afficher valeurs"}</span>
            </button>

            {/* Bouton Filtres */}
            <button
              onClick={() => setFilterOpen(true)}
              style={zenButtonStyle(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = zenColors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Filter size={16} />
              <span>Filtres</span>
            </button>

            {/* Bouton Upload */}
            <button
              onClick={() => setShowUpload(!showUpload)}
              style={zenButtonStyle(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = zenColors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <Upload size={16} />
              <span>Upload</span>
            </button>
          </div>

          {/* Bouton de déconnexion à droite */}
          <div>
            <button
              onClick={handleLogout}
              style={zenButtonStyle(false)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = zenColors.hover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Afficher le formulaire d'upload si showUpload est true */}
      {showUpload && (
        <div style={{
          padding: "20px",
          backgroundColor: zenColors.secondary,
          borderBottom: `1px solid ${zenColors.border}`
        }}>
          <UploadForm />
        </div>
      )}

      {/* Composant de filtre (s'affiche via son propre état) */}
      <LabelFieldFilterSheet />
    </>
  );
}