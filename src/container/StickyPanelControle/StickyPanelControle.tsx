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
    setTrigerSoumettre(!trigerSoumettre)

  }


  const handleLogout = () => {
    // Rediriger vers la racine
    router.push('/');
  };

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Boutons à gauche */}
          <div className="flex items-center space-x-2">
            {/* Bouton Dessiner */}
            <Button
              variant={isActiveDrawing ? "default" : "outline"}
              size="sm"
              onClick={handleNewDrawing}
              className="flex items-center gap-2"
            >
              <Pencil size={16} />
              <span>{isActiveDrawing ? "Arrêter dessin" : "Dessiner"}</span>
            </Button>

            {/* Bouton Soumettre - visible uniquement quand le dessin est actif */}
            {isActiveDrawing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrigerAtom}
                className="flex items-center gap-2"

              >
                <Save size={16} />
                <span>{"Soumettre les boîtes"}</span>
              </Button>
            )}

            {/* Bouton Afficher/Masquer valeurs */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleShowInputValue}
              className="flex items-center gap-2"
            >
              {showInputValue ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showInputValue ? "Masquer valeurs" : "Afficher valeurs"}</span>
            </Button>

            {/* Bouton Filtres */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              <span>Filtres</span>
            </Button>

            {/* Bouton Upload */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpload(!showUpload)}
              className="flex items-center gap-2"
            >
              <Upload size={16} />
              <span>Upload</span>
            </Button>
          </div>

          {/* Bouton de déconnexion à droite */}
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              <span>Déconnexion</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Afficher le formulaire d'upload si showUpload est true */}
      {showUpload && (
        <div className="p-4 border-b">
          <UploadForm />
        </div>
      )}

      {/* Composant de filtre (s'affiche via son propre état) */}
      <LabelFieldFilterSheet />
    </>
  );
}