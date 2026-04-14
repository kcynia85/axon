"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { KnowledgeStudioView } from "./KnowledgeStudioView";
import { useKnowledgeStudio } from "../application/useKnowledgeStudio";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { settingsApi } from "@/modules/settings/infrastructure/api";

/**
 * KnowledgeStudioContainer: Intelligent client container for the knowledge design experience.
 * Standard: Container pattern, orchestrates state and navigation.
 */
export const KnowledgeStudioContainer = () => {
    const router = useRouter();
    
    const { data: vectorDatabases = [], isLoading: isLoadingVectorStores } = useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });

    const { data: embeddingModels = [] } = useQuery({
        queryKey: ["embedding-models"],
        queryFn: () => settingsApi.getEmbeddingModels(),
    });

    const { data: knowledgeHubs = [], isLoading: isLoadingHubs } = useQuery({
        queryKey: ["knowledge-hubs"],
        queryFn: () => resourcesApi.getKnowledgeHubs(),
    });

    const { data: chunkingStrategies = [], isLoading: isLoadingStrategies } = useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });

    // Pass all dependencies to the hook for derived state calculation
    const studioState = useKnowledgeStudio(vectorDatabases, chunkingStrategies, knowledgeHubs, embeddingModels);

    const handleCancel = () => {
        router.back();
    };

    return (
        <KnowledgeStudioView
            {...studioState}
            hubs={knowledgeHubs}
            isLoadingHubs={isLoadingHubs}
            vectorStores={vectorDatabases}
            isLoadingVectorStores={isLoadingVectorStores}
            strategies={chunkingStrategies}
            isLoadingStrategies={isLoadingStrategies}
            onDataChange={studioState.handleDataChange}
            onSave={studioState.handleSave}
            onAutoTag={studioState.handleAutoTag}
            onSelectFile={studioState.handleSelectFile}
            onCancel={handleCancel}
        />
    );
};
