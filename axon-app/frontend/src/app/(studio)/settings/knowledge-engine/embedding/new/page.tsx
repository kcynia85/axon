"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { EmbeddingStudioView } from "@/modules/studio/features/embedding-studio/ui/EmbeddingStudioView";
import { useCreateEmbeddingModel } from "@/modules/settings/application/useSettings";

export default function NewEmbeddingModelPage() {
    const router = useRouter();
    const { mutateAsync: createModel, isPending } = useCreateEmbeddingModel();

    const handleSave = async (data: any) => {
        await createModel(data);
        router.push("/settings/knowledge-engine/embedding");
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/embedding");
    };

    return (
        <EmbeddingStudioView 
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isPending}
        />
    );
}
