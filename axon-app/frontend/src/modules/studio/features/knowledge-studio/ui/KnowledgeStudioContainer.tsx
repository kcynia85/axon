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
    
    const { data: vectorStores = [], isLoading: isLoadingVectorStores } = useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });

    const studioState = useKnowledgeStudio(vectorStores);

    const { data: hubs = [], isLoading: isLoadingHubs } = useQuery({
        queryKey: ["knowledge-hubs"],
        queryFn: () => resourcesApi.getKnowledgeHubs(),
    });

    const { data: strategies = [], isLoading: isLoadingStrategies } = useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });

    const handleCancel = () => {
        router.back();
    };

    return (
        <KnowledgeStudioView
            {...studioState}
            hubs={hubs}
            isLoadingHubs={isLoadingHubs}
            vectorStores={vectorStores}
            isLoadingVectorStores={isLoadingVectorStores}
            strategies={strategies}
            isLoadingStrategies={isLoadingStrategies}
            onDataChange={studioState.handleDataChange}
            onSave={studioState.handleSave}
            onAutoTag={studioState.handleAutoTag}
            onSelectFile={studioState.handleSelectFile}
            onCancel={handleCancel}
        />
    );
};
