"use client";

import DisplayFacture from "@/container/DisplayFactureCanvas/DisplayFacture";
import FormCanvasListDynamique from "@/container/FormCanvasDynamique/FormCanvasListDynamique";
import UploadForm from "@/container/UploadDocument/UploadForm";
import { Button } from "@/components/ui/button";
import { useAtom } from "jotai";
import LabelFieldFilterSheet, { filterOpenAtom } from "@/container/LabelFieldFilterSheet/LabelFieldFilterSheet";
import StickyPanel from "@/container/StickyPanelControle/StickyPanelControle";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

export default function Home() {
    const [, setFilterOpen] = useAtom(filterOpenAtom);

    return (
        <>
            <StickyPanel />
            <div>
                <div className="flex flex-col">
                    <div className="flex flex-row w-full">
                        <ResizablePanelGroup
                            direction="horizontal"
                            className="w-full h-[calc(100vh-80px)] border rounded-lg"
                        >
                            <ResizablePanel defaultSize={70} minSize={30} className="flex flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <DisplayFacture />
                                </div>
                            </ResizablePanel>
                            <ResizableHandle withHandle />
                            <ResizablePanel defaultSize={30} minSize={20} className="flex flex-col">
                                <div className="flex-1 overflow-hidden">
                                    <FormCanvasListDynamique />
                                </div>
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </div>
                </div>
            </div>
        </>
    );
}