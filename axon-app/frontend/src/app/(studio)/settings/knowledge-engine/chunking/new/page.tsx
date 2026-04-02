"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChunkingStudioView } from "@/modules/studio/features/chunking-studio/ui/ChunkingStudioView";
import { useCreateChunkingStrategy } from "@/modules/settings/application/useSettings";

export default function NewChunkingStrategyPage() {
    const router = useRouter();
    const { mutateAsync: createStrategy, isPending } = useCreateChunkingStrategy();

    const handleSave = async (data: any) => {
        await createStrategy(data);
        router.push("/settings/knowledge-engine/chunking");
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/chunking");
    };

    return (
        <ChunkingStudioView 
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isPending}
        />
    );
}
