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
    const { metaAgent, isLoading, updateMetaAgent, isUpdating } = useMetaAgent();
    
    const { data: llmModels, isLoading: isLoadingModels } = useQuery({
        queryKey: ["llm-models"],
        queryFn: settingsApi.getLLMModels,
    });

    const handleSave = async (data: MetaAgentStudioData) => {
        try {
            await updateMetaAgent(data);
            toast.success("Meta-Agent configuration updated successfully");
            
            // Wait a bit and go back to awareness view
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push("/settings/system/awareness");
            router.refresh();
        } catch (error) {
            console.error("Failed to update meta-agent:", error);
            toast.error("Failed to update Meta-Agent configuration");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading || isLoadingModels) {
        return (
            <div className="h-screen w-screen bg-black flex items-center justify-center">
                <div className="space-y-4 w-64">
                    <Skeleton className="h-12 w-full bg-white/5 rounded-xl" />
                    <Skeleton className="h-4 w-3/4 bg-white/5 rounded-lg mx-auto" />
                </div>
            </div>
        );
    }

    return (
        <MetaAgentStudio 
            initialData={metaAgent as any}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isUpdating}
            llmModels={llmModels}
            isLoadingModels={isLoadingModels}
        />
    );
};
