import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { LLMProvider } from "@/shared/domain/settings";

export const useLLMProviders = () => {
    return useQuery({
        queryKey: ["llm-providers"],
        queryFn: () => settingsApi.getLLMProviders(),
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
