import { useCallback, useRef, useState, useMemo } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { useForm } from "react-hook-form";
import { resourcesApi } from "@/modules/resources/infrastructure/api";

const KNOWLEDGE_STUDIO_SECTIONS: readonly KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "VECTOR_STORE", "HUBS"];

export const useKnowledgeStudio = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const form = useForm<KnowledgeResourceData>({
        defaultValues: {
            fileName: null,
            fileSize: null,
            metadata: [],
            chunkType: "General Text",
            vectorStoreId: "",
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
        setSelectedFile(file);
        setValue("fileName", file.name);
        setValue("fileSize", `${sizeInKb}kb`);
    };

    const handleSave = async () => {
        if (!selectedFile) {
            console.error("Please select a file to upload.");
            return;
        }

        if (!data.vectorStoreId) {
            console.error("Please select a vector store.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            // Extract format based on extension
            const extension = selectedFile.name.split('.').pop()?.toLowerCase() || "md";
            const validFormats = ["pdf", "md", "txt", "docx", "url"];
            const format = validFormats.includes(extension) ? extension : "md";
            
            const metadataPayload: any = {
                source_file_name: data.fileName,
                source_file_format: format,
                source_file_size_bytes: selectedFile.size,
                source_metadata: data.metadata.reduce((acc, curr) => ({...acc, [curr.key]: curr.value}), {}),
                source_chunking_strategy_ref: data.chunkType,
                vector_database_id: data.vectorStoreId,
            };
            
            if (data.hubs.length > 0) {
                // Assuming currently single hub assignment is supported by backend model `knowledge_hub_id`
                metadataPayload.knowledge_hub_id = data.hubs[0];
            }
            
            formData.append("metadata_json", JSON.stringify(metadataPayload));
            
            console.log("Uploading Knowledge Resource...", metadataPayload);
            await resourcesApi.uploadKnowledgeSource(formData);
            console.log("Upload initiated successfully!");
        } catch (error) {
            console.error("Failed to upload and index knowledge source", error);
        }
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
