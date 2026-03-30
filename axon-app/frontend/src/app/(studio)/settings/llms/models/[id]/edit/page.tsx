"use client";

import React, { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ModelStudioContainer } from "@/modules/studio/features/model-studio/ui/ModelStudioContainer";
import { useLLMModel } from "@/modules/settings/application/useSettings";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import type { ModelFormData } from "@/modules/studio/features/model-studio/types/model-schema";

const ModelEditPageContent = () => {
    const params = useParams();
    const modelId = params.id as string;
    const { data: model, isLoading, isError } = useLLMModel(modelId);
    const router = useRouter();

    const initialData = useMemo((): Partial<ModelFormData> | undefined => {
        if (!model) return undefined;

        return {
            provider_id: model.llm_provider_id,
            model_id: model.model_id,
            alias_name: model.model_display_name,
            reasoning_effort: (model.model_reasoning_effort as any) || "Medium",
            max_completion_tokens: model.model_context_window,
            custom_params: (model.model_custom_params as any) || [],
            system_prompt: model.model_system_prompt || "",
            pricing_input: (model.model_pricing_config.input as number) || 0,
            pricing_output: (model.model_pricing_config.output as number) || 0,
        };
    }, [model]);

    if (isLoading) {
        return (
            <div className="p-12 space-y-12 bg-black min-h-screen">
                <Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
                <Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
            </div>
        );
    }

    if (isError || !model) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white space-y-4">
                <h1 className="text-2xl font-bold">Model not found</h1>
                <button 
                    onClick={() => router.push("/settings/llms/models")}
                    className="text-zinc-400 hover:text-white underline font-mono"
                >
                    Back to inventory
                </button>
            </div>
        );
    }

    return (
        <ModelStudioContainer modelId={modelId} initialData={initialData} />
    );
};

export default function ModelEditPage() {
    return (
        <ModelEditPageContent />
    );
}
