"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../settings/infrastructure/api";
import { MetaAgent } from "@/shared/domain/system";

export const useMetaAgent = () => {
    const queryClient = useQueryClient();

    const { data: metaAgent, isLoading, error } = useQuery({
        queryKey: ["system-meta-agent"],
        queryFn: settingsApi.getMetaAgent,
    });

    const updateMetaAgentMutation = useMutation({
        mutationFn: (data: Partial<MetaAgent>) => settingsApi.updateMetaAgent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["system-meta-agent"] });
        },
    });

    return {
        metaAgent,
        isLoading,
        error,
        updateMetaAgent: updateMetaAgentMutation.mutateAsync,
        isUpdating: updateMetaAgentMutation.isPending,
    };
};
