import { useCallback, useRef, useState, useMemo } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { useForm } from "react-hook-form";

const KNOWLEDGE_STUDIO_SECTIONS: readonly KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "HUBS"];

export const useKnowledgeStudio = () => {
    const form = useForm<KnowledgeResourceData>({
        defaultValues: {
            fileName: null,
            fileSize: null,
            metadata: [],
            chunkType: "General Text",
            hubs: []
        }
    });

    const { watch, setValue } = form;
    const data = watch();

    const { 
        activeSectionIdentifier: activeSection, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier: scrollToSection 
    } = useStudioScrollSpy<KnowledgeStudioSectionId>(
        KNOWLEDGE_STUDIO_SECTIONS,
        "RESOURCE"
    );

    const handleDataChange = (updates: Partial<KnowledgeResourceData>) => {
        for (const [key, value] of Object.entries(updates)) {
            setValue(key as any, value);
        }
    };

    const handleAutoTag = () => {
        const currentMetadata = form.getValues("metadata") || [];
        setValue("metadata", [
            ...currentMetadata,
            { id: Date.now().toString(), key: "auto-tag", value: "generated" }
        ]);
    };

    const handleSelectFile = (file: File) => {
        const sizeInKb = Math.round(file.size / 1024);
        setValue("fileName", file.name);
        setValue("fileSize", `${sizeInKb}kb`);
    };

    const handleSave = () => {
        console.log("Saving Knowledge Resource", data);
    };

    return {
        form,
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
