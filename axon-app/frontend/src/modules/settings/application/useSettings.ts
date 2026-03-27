import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { LLMModel, LLMRouter } from "@/shared/domain/settings";

export const useLLMModels = () => {
    return useQuery({
        queryKey: ["llm-models"],
        queryFn: () => settingsApi.getLLMModels(),
    });
}

export const useCreateLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (model: Omit<LLMModel, "id" | "created_at" | "updated_at">) => settingsApi.createLLMModel(model),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
        },
    });
}

export const useUpdateLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<LLMModel> }) => settingsApi.updateLLMModel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
        },
    });
}

export const useDeleteLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteLLMModel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
        },
    });
}

export const useLLMRouters = () => {
    return useQuery({
        queryKey: ["llm-routers"],
        queryFn: () => settingsApi.getLLMRouters(),
    });
}

export const useCreateLLMRouter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (router: Omit<LLMRouter, "id" | "created_at" | "updated_at">) => settingsApi.createLLMRouter(router),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-routers"] });
        },
    });
}

export const useUpdateLLMRouter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<LLMRouter> }) => settingsApi.updateLLMRouter(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-routers"] });
        },
    });
}

export const useDeleteLLMRouter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteLLMRouter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-routers"] });
        },
    });
}

export const useEmbeddingModels = () => {
    return useQuery({
        queryKey: ["embedding-models"],
        queryFn: () => settingsApi.getEmbeddingModels(),
    });
}

export const useChunkingStrategies = () => {
    return useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });
}

export const useVectorDatabases = () => {
    return useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });
}
