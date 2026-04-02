import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { LLMProvider } from "@/shared/domain/settings";

export const useLLMProviders = () => {
    return useQuery({
        queryKey: ["llm-providers"],
        queryFn: () => settingsApi.getLLMProviders(),
    });
}

export const useLLMProvider = (id: string) => {
    return useQuery({
        queryKey: ["llm-providers", id],
        queryFn: () => settingsApi.getLLMProvider(id),
        enabled: !!id,
    });
}

export const useAvailableModels = (providerId?: string) => {
    return useQuery({
        queryKey: ["llm-providers", providerId, "available-models"],
        queryFn: () => providerId ? settingsApi.getAvailableModels(providerId) : Promise.resolve([]),
        enabled: !!providerId,
    });
}

export const useCreateLLMProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: Omit<LLMProvider, "id" | "created_at" | "updated_at">) => settingsApi.createLLMProvider(provider),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-providers"] });
        },
    });
}

export const useUpdateLLMProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<LLMProvider> }) => settingsApi.updateLLMProvider(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-providers"] });
        },
    });
}

export const useDeleteLLMProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteLLMProvider(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-providers"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useSyncProviderPricing = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.syncLLMProviderPricing(id),
        onSuccess: () => {
            // Invalidate providers to update pricing_last_synced_at
            queryClient.invalidateQueries({ queryKey: ["llm-providers"] });
            // Invalidate models to show updated pricing_input/output in the table
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
        },
    });
}
