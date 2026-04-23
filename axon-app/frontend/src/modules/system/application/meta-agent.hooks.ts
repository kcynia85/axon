"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../settings/infrastructure/api";
import { MetaAgent, VoiceMetaAgent } from "@/shared/domain/system";

export const useMetaAgent = () => {
    const queryClient = useQueryClient();

    const { data: metaAgent, isLoading: isLoadingMeta, error: metaError } = useQuery({
        queryKey: ["system-meta-agent"],
        queryFn: settingsApi.getMetaAgent,
    });

    const { data: voiceMetaAgent, isLoading: isLoadingVoice, error: voiceError } = useQuery({
        queryKey: ["system-voice-meta-agent"],
        queryFn: settingsApi.getVoiceMetaAgent,
    });

    const updateMetaAgentMutation = useMutation({
        mutationFn: (data: Partial<MetaAgent>) => settingsApi.updateMetaAgent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-meta-agent"] });
        },
    });

    const updateVoiceMutation = useMutation({
        mutationFn: (data: Partial<VoiceMetaAgent>) => settingsApi.updateVoiceMetaAgent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-voice-meta-agent"] });
        },
    });

    return {
        metaAgent,
        voiceMetaAgent,
        isLoading: isLoadingMeta || isLoadingVoice,
        error: metaError || voiceError,
        updateMetaAgent: updateMetaAgentMutation.mutateAsync,
        updateVoice: updateVoiceMutation.mutateAsync,
        isUpdating: updateMetaAgentMutation.isPending || updateVoiceMutation.isPending,
    };
};
