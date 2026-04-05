import { useCallback, useRef, useState } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";

const KNOWLEDGE_STUDIO_SECTIONS: readonly KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "HUBS"];

export const useKnowledgeStudio = () => {
    const [data, setData] = useState<KnowledgeResourceData>({
        fileName: null,
        fileSize: null,
        metadata: [],
        chunkType: "General Text",
        hubs: []
    });

    const { 
        activeSectionIdentifier: activeSection, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier: scrollToSection 
    } = useStudioScrollSpy<KnowledgeStudioSectionId>(
        KNOWLEDGE_STUDIO_SECTIONS,
        "RESOURCE"
    );

    const handleDataChange = (updates: Partial<KnowledgeResourceData>) => {
        setData(previousData => ({ ...previousData, ...updates }));
    };

    const handleAutoTag = () => {
        setData(previousData => ({
            ...previousData,
            metadata: [
                ...previousData.metadata,
                { id: Date.now().toString(), key: "auto-tag", value: "generated" }
            ]
        }));
    };

    const handleSelectFile = (file: File) => {
        console.log("useKnowledgeStudio: File received", file.name, file.size);
        const sizeInKb = Math.round(file.size / 1024);
        setData(previousData => {
            console.log("useKnowledgeStudio: Updating state with file", file.name);
            return {
                ...previousData,
                fileName: file.name,
                fileSize: `${sizeInKb}kb`
            };
        });
    };

    const handleSave = () => {
        console.log("Saving Knowledge Resource", data);
    };

    return {
        data,
        activeSection,
        handleDataChange,
        handleSave,
        handleAutoTag,
        handleSelectFile,
        scrollToSection,
        setCanvasContainerReference
    };
};
