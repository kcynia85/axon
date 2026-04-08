"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EmbeddingStudio } from "@/modules/studio/features/embedding-studio/ui/EmbeddingStudio";
import { useCreateEmbeddingModel } from "@/modules/settings/application/useSettings";
import { toast } from "sonner";

export default function NewEmbeddingModelPage() {
    const router = useRouter();
    const { mutateAsync: createModel, isPending } = useCreateEmbeddingModel();

    const handleSave = async (data: any) => {
        await createModel(data);
        if (data.is_draft) {
            toast.info("Szkic modelu został zapisany.");
        } else {
            toast.success("Model utworzony. Rozpoczęto indeksację bazy (Hard Reset).");
        }
        router.push("/settings/knowledge-engine/embedding");
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/embedding");
    };

    return (
        <EmbeddingStudio 
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isPending}
            modelId="new"
        />
    );
}
