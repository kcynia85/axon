import { useState } from "react";
import { KnowledgeResourceData, KnowledgeStudioSectionId } from "../types/knowledge-studio.types";
import { useStudioScrollSpy } from "@/modules/studio/application/hooks/useStudioScrollSpy";
import { useForm } from "react-hook-form";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { VectorDatabase, EmbeddingModel } from "@/shared/domain/settings";

const KNOWLEDGE_STUDIO_SECTIONS: readonly KnowledgeStudioSectionId[] = ["RESOURCE", "METADATA", "STRATEGY", "VECTOR_STORE", "HUBS"];

/**
 * useKnowledgeStudio: Application hook for managing resource design logic.
 * Standard: 0% useEffect, 0% useCallback, 0% useMemo.
 * React Compiler handles optimizations.
 */
export const useKnowledgeStudio = (
    vectorDatabases: VectorDatabase[] = [], 
    chunkingStrategies: any[] = [],
    knowledgeHubs: any[] = [],
    embeddingModels: EmbeddingModel[] = []
) => {
    const router = useRouter();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [isGlobalDragging, setIsGlobalDragging] = useState(false);
    const [isLocalFileOver, setIsLocalFileOver] = useState(false);

    const form = useForm<KnowledgeResourceData>({
        defaultValues: {
            fileName: null,
            fileSize: null,
            metadata: [],
            chunkTypeId: "",
            chunkType: "Wybierz strategię...",
            vectorStoreId: vectorDatabases.find(db => db.vector_database_name === "Supabase Local")?.id || "",
            hubs: [],
            tags: [],
            simulatedChunks: [],
            tokenCount: 0,
            estimatedCost: 0
        }
    });

    const data = form.watch();

    // --- Derived State ---

    const strategyOptions = chunkingStrategies.map((strategy) => ({
		id: strategy.id,
		name: strategy.strategy_name,
		subtitle: strategy.strategy_chunking_method,
	}));

    const selectedHubNames = (data.hubs || [])
		.map(hubId => knowledgeHubs.find(hub => hub.id === hubId)?.hub_name)
		.filter((name): name is string => !!name);

    let estimatedTokenCount = 0;
    if (data.simulatedChunks.length > 0) {
        const totalContentLength = data.simulatedChunks.reduce((accumulator, chunk) => 
            accumulator + (chunk.text?.length || chunk.length || 0), 0
        );
        estimatedTokenCount = Math.ceil(totalContentLength / 4);
    } else if (selectedFile) {
        estimatedTokenCount = Math.ceil(selectedFile.size / 4);
    }

    const selectedVectorDb = vectorDatabases.find(database => database.id === data.vectorStoreId);
    const associatedModel = embeddingModels.find(model => 
        model.model_id === selectedVectorDb?.vector_database_embedding_model_reference
    );

    const pricePerToken = (associatedModel?.model_cost_per_1m_tokens || 0) / 1_000_000;
    const estimatedIndexingCost = estimatedTokenCount * pricePerToken;

    // --- Logic Functions ---

    const handleSimulateChunking = async (file: File, strategyId: string) => {
        if (!file || !strategyId) return;
        
        setIsSimulating(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("strategy_id", strategyId);
            
            const result = await resourcesApi.getKnowledgeResourcePreview(formData);
            form.setValue("simulatedChunks", result.chunks);
        } catch (error) {
            console.error("Simulation failed", error);
        } finally {
            setIsSimulating(false);
        }
    };

    const handleSelectFile = (file: File) => {
        const sizeInKilobytes = Math.round(file.size / 1024);
        setSelectedFile(file);
        form.setValue("fileName", file.name);
        form.setValue("fileSize", `${sizeInKilobytes}kb`);
        
        if (data.chunkTypeId) {
            handleSimulateChunking(file, data.chunkTypeId);
        }
    };

    const handleDataChange = (updates: Partial<KnowledgeResourceData>) => {
        for (const [key, value] of Object.entries(updates)) {
            form.setValue(key as any, value);
            
            if (key === "chunkTypeId" && selectedFile) {
                handleSimulateChunking(selectedFile, value as string);
            }
        }
    };

    const handleAutoTag = () => {
        const currentMetadata = form.getValues("metadata") || [];
        form.setValue("metadata", [
            ...currentMetadata,
            { id: Date.now().toString(), key: "auto-tag", value: "generated" }
        ]);
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

        if (!data.hubs || data.hubs.length === 0) {
            toast.error("Wybierz przynajmniej jeden Hub Wiedzy.");
            return;
        }

        setIsSaving(true);
        const loadingToast = toast.loading("Przesyłanie zasobu...");

        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            
            const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase() || "md";
            const validFormats = ["pdf", "md", "txt", "docx", "url"];
            const resourceFormat = validFormats.includes(fileExtension) ? fileExtension : "md";

            // Safeguard for metadata reduction
            const metadataObject = (data.metadata || []).reduce((accumulator, current) => {
                if (current.key && current.value) {
                    accumulator[current.key] = current.value;
                }
                return accumulator;
            }, {} as Record<string, any>);

            const metadataPayload: any = {
                resource_file_name: data.fileName,
                resource_file_format: resourceFormat,
                resource_file_size_bytes: selectedFile.size,
                resource_metadata: {
                    ...metadataObject,
                    tags: data.tags || []
                },
                resource_chunking_strategy_ref: data.chunkTypeId,
                vector_database_id: data.vectorStoreId,
                vector_database_config: selectedVectorDb ? {
                    name: selectedVectorDb.vector_database_name,
                    type: selectedVectorDb.vector_database_type,
                    host: selectedVectorDb.vector_database_host,
                    port: selectedVectorDb.vector_database_port,
                    user: selectedVectorDb.vector_database_user,
                    password: selectedVectorDb.vector_database_password,
                    db_name: selectedVectorDb.vector_database_db_name,
                    collection_name: selectedVectorDb.vector_database_collection_name,
                    embedding_model: selectedVectorDb.vector_database_embedding_model_reference,
                    dimensions: selectedVectorDb.vector_database_expected_dimensions,
                    index_method: selectedVectorDb.vector_database_index_method,
                    connection_url: selectedVectorDb.vector_database_connection_url || selectedVectorDb.vector_database_connection_string
                } : null
            };

            // Add Knowledge Hub association if selected
            if (data.hubs && data.hubs.length > 0) {
                metadataPayload.knowledge_hub_id = data.hubs[0]; // Currently supporting one hub per resource
            }
            
            formData.append("metadata_json", JSON.stringify(metadataPayload));
            
            console.log("DEBUG: Uploading resource with payload:", metadataPayload);
            await resourcesApi.uploadKnowledgeResource(formData);
            
            toast.success("Zasób został pomyślnie przesłany i jest w kolejce do indeksowania.", { id: loadingToast });
            router.push("/resources/knowledge");

        } catch (error) {
            console.error("Failed to upload knowledge resource:", error);
            toast.error("Wystąpił błąd podczas wysyłania zasobu. Sprawdź konsolę.", { id: loadingToast });
        } finally {
            setIsSaving(false);
        }
    };

    const { 
        activeSectionIdentifier: activeSection, 
        setCanvasContainerReference, 
        scrollToSectionIdentifier: scrollToSection 
    } = useStudioScrollSpy<KnowledgeStudioSectionId>(
        KNOWLEDGE_STUDIO_SECTIONS,
        "RESOURCE"
    );

    return {
        form,
        data: {
            ...data,
            tokenCount: estimatedTokenCount,
            estimatedCost: estimatedIndexingCost
        },
        activeSection,
        isSimulating,
        isSaving,
        isGlobalDragging,
        isLocalFileOver,
        strategyOptions,
        selectedHubNames,
        setIsGlobalDragging,
        setIsLocalFileOver,
        handleDataChange,
        handleSave,
        handleAutoTag,
        handleSelectFile,
        scrollToSection,
        setCanvasContainerReference
    };
};
