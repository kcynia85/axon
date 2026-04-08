"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChunkingStudio } from "@/modules/studio/features/chunking-studio/ui/ChunkingStudio";
import { useCreateChunkingStrategy } from "@/modules/settings/application/useSettings";
import { toast } from "sonner";

export default function NewChunkingStrategyPage() {
    const router = useRouter();
    const { mutateAsync: createStrategy, isPending } = useCreateChunkingStrategy();

    const handleSave = async (data: any) => {
        try {
            await createStrategy(data);
            if (data.is_draft) {
                toast.info("Szkic strategii został zapisany.");
            } else {
                toast.success("Strategia została utworzona.");
            }
            router.push("/settings/knowledge-engine/chunking");
        } catch (error: any) {
            toast.error(`Błąd zapisu: ${error.message || "Wystąpił nieoczekiwany błąd"}`);
        }
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/chunking");
    };

    return (
        <ChunkingStudio 
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isPending}
            strategyId="new"
        />
    );
}
