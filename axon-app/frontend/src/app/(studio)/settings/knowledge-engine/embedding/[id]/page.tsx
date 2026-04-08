"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { EmbeddingStudio } from "@/modules/studio/features/embedding-studio/ui/EmbeddingStudio";
import { useEmbeddingModels, useUpdateEmbeddingModel, useCreateEmbeddingModel } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { toast } from "sonner";

export default function EditEmbeddingModelPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { data: models, isLoading } = useEmbeddingModels();
    const { mutateAsync: updateModel, isPending: isUpdating } = useUpdateEmbeddingModel();
    const { mutateAsync: createModel, isPending: isCreating } = useCreateEmbeddingModel();
    
    const modelFromApi = models?.find(m => m.id === id);
    const isMock = id.includes("mock");

    const handleSave = async (data: any) => {
        try {
            if (isMock) {
                // If it's a mock, we treat "save" as "create new real model"
                await createModel(data);
                if (data.is_draft) {
                    toast.info("Szkic modelu został zapisany.");
                } else {
                    toast.success("Model utworzony na podstawie wzorca. Rozpoczęto re-indeksację.");
                }
            } else {
                await updateModel({ id, data });
                if (data.is_draft) {
                    toast.info("Szkic modelu został zaktualizowany.");
                } else {
                    toast.success("Model zaktualizowany. Rozpoczęto re-indeksację bazy (Hard Reset).");
                }
            }
            router.push("/settings/knowledge-engine/embedding");
        } catch (error: any) {
            toast.error(`Błąd zapisu: ${error.message}`);
        }
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/embedding");
    };

    if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    
    // Support mock data for demonstration
    const model = modelFromApi || (isMock ? {
        id,
        model_provider_name: id === "mock-1" ? "OpenAI" : "Google",
        model_id: id === "mock-1" ? "text-embedding-3-small" : "gemini-embedding-001",
        model_vector_dimensions: id === "mock-1" ? 1536 : 768,
        model_max_context_tokens: 8191,
        model_cost_per_1m_tokens: 0.02,
        is_draft: false
    } : null);

    if (!model) return <div>Model not found</div>;

    return (
        <EmbeddingStudio 
            initialData={model}
            onSave={handleSave}
            onExit={handleExit}
            isSaving={isUpdating || isCreating}
            modelId={id}
        />
    );
}
