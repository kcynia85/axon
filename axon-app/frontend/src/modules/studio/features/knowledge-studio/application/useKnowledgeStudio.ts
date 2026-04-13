import { useCallback, useRef, useState, useMemo } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { useForm } from "react-hook-form";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { VectorDatabase } from "@/shared/domain/settings";

const KNOWLEDGE_STUDIO_SECTIONS: readonly KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "VECTOR_STORE", "HUBS"];

export const useKnowledgeStudio = (vectorStores: VectorDatabase[] = []) => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<KnowledgeResourceData>({
        defaultValues: {
            fileName: null,
            fileSize: null,
            metadata: [],
            chunkTypeId: "",
            chunkType: "Wybierz strategię...",
            vectorStoreId: "",
            hubs: [],
            tags: [],
            simulatedChunks: []
        }
    });

    const { watch, setValue } = form;
    const data = watch();

    const handleSimulateChunking = useCallback(async (file: File, strategyId: string) => {
        if (!file || !strategyId) return;
        
        setIsSimulating(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("strategy_id", strategyId);
            
            const result = await resourcesApi.getKnowledgeResourcePreview(formData);
            setValue("simulatedChunks", result.chunks);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setIsSimulating(false);
        }
    }, [setValue]);

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
            
            // Trigger simulation if strategy or file changes
            if (key === "chunkTypeId" && selectedFile) {
                handleSimulateChunking(selectedFile, value as string);
            }
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
        
        if (data.chunkTypeId) {
            handleSimulateChunking(file, data.chunkTypeId);
        }
    };

    const handleSave = async () => {
        if (!selectedFile) {
            toast.error("Wybierz plik przed zapisem.");
            return;
        }

        if (!data.vectorStoreId) {
            toast.error("Wybierz bazę wektorową.");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Przesyłanie zasobu...");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const extension = selectedFile.name.split('.').pop()?.toLowerCase() || "md";
            const validFormats = ["pdf", "md", "txt", "docx", "url"];
            const format = validFormats.includes(extension) ? extension : "md";
            
            const selectedVdb = vectorStores.find(db => db.id === data.vectorStoreId);

            const metadataPayload: any = {
                resource_file_name: data.fileName,
                resource_file_format: format,
                resource_file_size_bytes: selectedFile.size,
                resource_metadata: {
                    ...data.metadata.reduce((acc, curr) => ({...acc, [curr.key]: curr.value}), {}),
                    tags: data.tags || []
                },
                resource_chunking_strategy_ref: data.chunkTypeId,
                vector_database_id: data.vectorStoreId,
                vector_database_config: selectedVdb ? {
                    name: selectedVdb.vector_database_name,
                    type: selectedVdb.vector_database_type,
                    host: selectedVdb.vector_database_host,
                    port: selectedVdb.vector_database_port,
                    user: selectedVdb.vector_database_user,
                    password: selectedVdb.vector_database_password,
                    db_name: selectedVdb.vector_database_db_name,
                    collection_name: selectedVdb.vector_database_collection_name,
                    embedding_model: selectedVdb.vector_database_embedding_model_reference,
                    dimensions: selectedVdb.vector_database_expected_dimensions,
                    index_method: selectedVdb.vector_database_index_method,
                    connection_url: selectedVdb.vector_database_connection_url || selectedVdb.vector_database_connection_string
                } : null
            };
            
            if (data.hubs.length > 0) {
                metadataPayload.knowledge_hub_id = data.hubs[0];
            }
            
            formData.append("metadata_json", JSON.stringify(metadataPayload));
            
            const resource = await resourcesApi.uploadKnowledgeResource(formData);
            const resourceId = resource.id;

            toast.loading("Trwa indeksowanie... Proszę czekać.", { id: loadingToast });

            // POLLING LOGIC
            let isDone = false;
            let attempts = 0;
            const maxAttempts = 60; // 60 seconds

            while (!isDone && attempts < maxAttempts) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;

                try {
                    const allResources = await resourcesApi.getKnowledgeResources();
                    const currentResource = allResources.find((s: any) => s.id === resourceId);

                    if (currentResource) {
                        if (currentResource.resource_rag_indexing_status === "Ready") {                            toast.success("Zasób zaindeksowany pomyślnie!", { id: loadingToast });
                            isDone = true;
                            router.push("/resources/knowledge");
                            return;
                        }
                        // If status is "Indexing" or "Pending", we just continue looping
                    } 
                    // If not found yet, we also just continue looping (it might take a moment to appear)
                    
                } catch (e) {
                    console.error("Polling error", e);
                }
            }

            if (!isDone) {
                // Final check - if still not found or not ready, it's likely an error (since backend filters out errors from list)
                toast.error("Indeksowanie trwa zbyt długo lub wystąpił błąd. Sprawdź Sidepeek w Bazie Wiedzy.", { id: loadingToast });
                router.push("/resources/knowledge");
            }

        } catch (error) {
            console.error("Failed to upload and index knowledge source", error);
            toast.error("Wystąpił błąd podczas wysyłania zasobu.", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    return {
        form,
        data,
        activeSection,
        isSimulating,
        isSaving,
        handleDataChange,
        handleSave,
        handleAutoTag,
        handleSelectFile,
        scrollToSection,
        setCanvasContainerReference
    };
};
