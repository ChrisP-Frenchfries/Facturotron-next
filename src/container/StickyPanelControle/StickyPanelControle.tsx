"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { Filter, Upload, Pencil, Save, Eye, EyeOff, LogOut } from "lucide-react";
import LabelFieldFilterSheet, { filterOpenAtom } from "../LabelFieldFilterSheet/LabelFieldFilterSheet";
import UploadForm from "../UploadDocument/UploadForm";
import { activeCanvasDrawingAtom, activeInputValueAtom } from "@/atom/canvas.atom";
import { boundingBoxesAtom } from "@/atom/canvas.atom";
import { trigerSoumettreBoites } from "@/atom/header.atom";
import { AnimatePresence } from "framer-motion";

export default function StickyPanel() {
  const [, setFilterOpen] = useAtom(filterOpenAtom);
  const [showUpload, setShowUpload] = useState(false);
  const [isActiveDrawing, setIsActiveDrawing] = useAtom(activeCanvasDrawingAtom);
  const [showInputValue, setShowInputValue] = useAtom(activeInputValueAtom);
  const [boundingBoxes] = useAtom(boundingBoxesAtom);
  const [trigerSoumettre, setTrigerSoumettre] = useAtom(trigerSoumettreBoites);
  const router = useRouter();

  // Persistance des états avec localStorage
  useEffect(() => {
    const savedShowUpload = localStorage.getItem('showUpload');
    const savedShowInputValue = localStorage.getItem('showInputValue');

    if (savedShowUpload) setShowUpload(JSON.parse(savedShowUpload));
    if (savedShowInputValue) setShowInputValue(JSON.parse(savedShowInputValue));
  }, []);

  useEffect(() => {
    localStorage.setItem('showUpload', JSON.stringify(showUpload));
  }, [showUpload]);

  useEffect(() => {
    localStorage.setItem('showInputValue', JSON.stringify(showInputValue));
  }, [showInputValue]);

  const handleNewDrawing = () => {
    setIsActiveDrawing(!isActiveDrawing);
  };

  const handleShowInputValue = () => {
    setShowInputValue(!showInputValue);
  };

  const handleTrigerAtom = () => {
    setTrigerSoumettre(!trigerSoumettre);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-[#E6F2E1] border-b border-[#B8D8BA] shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Boutons à gauche */}
          <div className="flex items-center gap-3">
            {/* Bouton Dessiner */}
            <button
              onClick={handleNewDrawing}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full transition-all duration-200 
                ${isActiveDrawing
                  ? "bg-[#7FB069] text-white border border-[#7FB069]"
                  : "bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995]"}`}
            >
              <Pencil size={16} />
              <span>{isActiveDrawing ? "Arrêter dessin" : "Dessiner"}</span>
            </button>

            {/* Bouton Soumettre - visible uniquement quand le dessin est actif */}
            {isActiveDrawing && (
              <button
                onClick={handleTrigerAtom}
                className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
              >
                <Save size={16} />
                <span>Soumettre les boîtes</span>
              </button>
            )}

            {/* Bouton Afficher/Masquer valeurs */}
            <button
              onClick={handleShowInputValue}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
            >
              {showInputValue ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showInputValue ? "Masquer valeurs" : "Afficher valeurs"}</span>
            </button>

            {/* Bouton Filtres */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
            >
              <Filter size={16} />
              <span>Filtres</span>
            </button>

            {/* Bouton Upload */}
            <button
              onClick={() => setShowUpload(!showUpload)}
              className={`flex items-center gap-2 px-4 py-1.5 text-sm rounded-full transition-all duration-200 
                ${showUpload
                  ? "bg-[#7FB069] text-white border border-[#7FB069]"
                  : "bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995]"}`}
            >
              <Upload size={16} />
              <span>{showUpload ? "Fermer" : "Upload"}</span>
            </button>
          </div>

          {/* Bouton de déconnexion à droite */}
          <div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-1.5 text-sm rounded-full bg-transparent text-[#2C5530] border border-[#B8D8BA] hover:bg-[#9BC995] transition-all duration-200"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>

      {/* Formulaire d'upload avec animation de fermeture */}
      <div className="sticky top-16 z-40 w-full">
        <AnimatePresence>
          {showUpload && <UploadForm />}
        </AnimatePresence>
      </div>

      {/* Composant de filtre (s'affiche via son propre état) */}
      <LabelFieldFilterSheet />
    </>
  );
}