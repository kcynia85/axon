"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { EmbeddingStudioView } from "@/modules/studio/features/embedding-studio/ui/EmbeddingStudioView";
import { useEmbeddingModels } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

export default function EditEmbeddingModelPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    
    const { data: models, isLoading } = useEmbeddingModels();
    const modelFromApi = models?.find(m => m.id === id);

    const handleSave = async (data: any) => {
        console.log("Saving model:", id, data);
        router.push("/settings/knowledge-engine/embedding");
    };

    const handleExit = () => {
        router.push("/settings/knowledge-engine/embedding");
    };

    if (isLoading) return <div className="h-screen w-screen bg-black flex items-center justify-center"><Skeleton className="h-full w-full" /></div>;
    
    // Support mock data for demonstration
    const model = modelFromApi || (id.includes("mock") ? {
        id,
        model_provider_name: id === "mock-1" ? "OpenAI" : "Google",
        model_id: id === "mock-1" ? "text-embedding-3-small" : "gemini-embedding-001",
        model_vector_dimensions: id === "mock-1" ? 1536 : 768,
        model_max_context_tokens: 8191,
        model_cost_per_1m_tokens: 0.02,
    } : null);

    if (!model) return <div>Model not found</div>;

    return (
        <EmbeddingStudioView 
            initialData={model}
            onSave={handleSave}
            onExit={handleExit}
        />
    );
}
