"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMetaAgent } from "@/modules/system/application/meta-agent.hooks";
import { useQuery } from "@tanstack/react-query";
import { settingsApi } from "@/modules/settings/infrastructure/api";
import { MetaAgentStudio } from "./MetaAgentStudio";
import { MetaAgentStudioData } from "../types/meta-agent-schema";
import { toast } from "sonner";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

export const MetaAgentStudioContainer = () => {
    const router = useRouter();
    const { 
        metaAgent, 
        voiceMetaAgent,
        isLoading, 
        updateMetaAgent, 
        updateVoice,
        isUpdating 
    } = useMetaAgent();
    
    const { data: llmModels, isLoading: isLoadingModels } = useQuery({
        queryKey: ["llm-models"],
        queryFn: settingsApi.getLLMModels,
    });

    const { data: llmRouters, isLoading: isLoadingRouters } = useQuery({
        queryKey: ["llm-routers"],
        queryFn: settingsApi.getLLMRouters,
    });

    const handleSave = async (data: MetaAgentStudioData) => {
        try {
            // Split data into meta-agent and voice-agent updates
            const metaAgentData = {
                meta_agent_system_prompt: data.meta_agent_system_prompt,
                meta_agent_temperature: data.meta_agent_temperature,
                meta_agent_rag_enabled: data.meta_agent_rag_enabled,
                llm_model_id: data.llm_model_id,
            };

            const voiceData = {
                voice_provider: data.voice_provider,
                interaction_mode: data.interaction_mode,
                provider_config: data.provider_config,
                // Optionally keep the system prompt synced if desired, 
                // but the UI currently only exposes it for the core meta-agent
            };

            await Promise.all([
                updateMetaAgent(metaAgentData),
                updateVoice(voiceData)
            ]);

            toast.success("Meta-Agent and Voice configuration updated successfully");
            
            // Wait a bit and go back to awareness view
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push("/settings/system/awareness");
            router.refresh();
        } catch (error) {
            console.error("Failed to update meta-agent:", error);
            toast.error("Failed to update configuration");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading || isLoadingModels || isLoadingRouters) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="space-y-4 w-64">
                    <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 bg-white/5 rounded-lg mx-auto" />
                </div>
            </div>
        );
    }

    // Combine data for the form
    const combinedData = {
        ...metaAgent,
        ...voiceMetaAgent
    };

    return (
        <MetaAgentStudio 
            initialData={combinedData as any}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isUpdating}
            llmModels={llmModels}
            isLoadingModels={isLoadingModels || isLoadingRouters}
            llmRouters={llmRouters}
        />
    );
};
