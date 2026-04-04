"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { ChunkingStudioView } from "@/modules/studio/features/chunking-studio/ui/ChunkingStudioView";
import { useChunkingStrategies, useUpdateChunkingStrategy, useCreateChunkingStrategy } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { toast } from "sonner";

export default function EditChunkingStrategyPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { data: strategies, isLoading } = useChunkingStrategies();
    const { mutateAsync: updateStrategy, isPending: isUpdating } = useUpdateChunkingStrategy();
    const { mutateAsync: createStrategy, isPending: isCreating } = useCreateChunkingStrategy();
    
    const strategyFromApi = strategies?.find(s => s.id === id);
    const isMock = id.includes("mock");

    const handleSave = async (data: any) => {
        try {
            if (isMock) {
                await createStrategy(data);
                if (data.is_draft) {
                    toast.info("Szkic strategii został zapisany.");
                } else {
                    toast.success("Strategia została utworzona.");
                }
            } else {
                await updateStrategy({ id, data });
                if (data.is_draft) {
                    toast.info("Szkic strategii został zaktualizowany.");
                } else {
                    toast.success("Strategia została zaktualizowana.");
                }
            }
            router.push("/settings/knowledge-engine/chunking");
        } catch (error: any) {
            toast.error(`Błąd zapisu: ${error.message}`);
        }
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/chunking");
    };

    if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    
    // Support mock data for demonstration
    const strategy = strategyFromApi || (isMock ? {
        id,
        strategy_name: "Mock Strategy",
        strategy_chunking_method: "Recursive_Character",
        strategy_chunk_size: 1000,
        strategy_chunk_overlap: 200,
        strategy_chunk_boundaries: { separators: ["\\n\\n", "\\n", " "] },
        is_draft: false
    } : null);

    if (!strategy) return <div>Strategy not found</div>;

    return (
        <ChunkingStudioView 
            initialData={strategy}
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isUpdating || isCreating}
            strategyId={id}
        />
    );
}
