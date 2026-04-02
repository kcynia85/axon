"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ChunkingStudioView } from "@/modules/studio/features/chunking-studio/ui/ChunkingStudioView";
import { useChunkingStrategies } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

export default function EditChunkingStrategyPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { data: strategies, isLoading } = useChunkingStrategies();
    const strategyFromApi = strategies?.find(s => s.id === id);

    const handleSave = async (data: any) => {
        console.log("Saving strategy:", id, data);
        router.push("/settings/knowledge-engine/chunking");
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/chunking");
    };

    if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    
    // Support mock data for demonstration
    const strategy = strategyFromApi || (id.includes("mock") ? {
        id,
        strategy_name: "Mock Strategy",
        strategy_chunking_method: "Recursive_Character",
        strategy_chunk_size: 1000,
        strategy_chunk_overlap: 200,
        strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] }
    } : null);

    if (!strategy) return <div>Strategy not found</div>;

    return (
        <ChunkingStudioView 
            initialData={strategy}
            onSave={handleSave}
            onExit={handleExit}
        />
    );
}
