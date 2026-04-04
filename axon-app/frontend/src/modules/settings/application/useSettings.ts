import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { LLMModel, LLMRouter } from "@/shared/domain/settings";

export const useLLMModels = () => {
    return useQuery({
        queryKey: ["llm-models"],
        queryFn: () => settingsApi.getLLMModels(),
    });
}

export const useLLMModel = (id?: string) => {
    return useQuery({
        queryKey: ["llm-models", id],
        queryFn: () => id ? settingsApi.getLLMModel(id) : Promise.reject("No ID provided"),
        enabled: !!id,
    });
}

export const useCreateLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (model: Omit<LLMModel, "id" | "created_at" | "updated_at">) => settingsApi.createLLMModel(model),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useUpdateLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<LLMModel> }) => settingsApi.updateLLMModel(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useDeleteLLMModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteLLMModel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-models"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useLLMModelUsage = (id?: string) => {
    return useQuery({
        queryKey: ["llm-models", id, "usage"],
        queryFn: () => id ? settingsApi.getLLMModelUsage(id) : Promise.reject("No ID provided"),
        enabled: !!id,
    });
}

export const useTestLLMModel = () => {
    return useMutation({
        mutationFn: ({ id, prompt }: { id: string, prompt: string }) => settingsApi.testLLMModel(id, prompt),
    });
}

export const useTestLLMProvider = () => {
    return useMutation({
        mutationFn: (id: string) => settingsApi.testLLMProvider(id),
    });
}

export const useLLMRouters = () => {
    return useQuery({
        queryKey: ["llm-routers"],
        queryFn: () => settingsApi.getLLMRouters(),
    });
}

export const useLLMRouter = (id?: string) => {
    return useQuery({
        queryKey: ["llm-routers", id],
        queryFn: () => id ? settingsApi.getLLMRouter(id) : Promise.reject("No ID provided"),
        enabled: !!id,
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
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["llm-routers"] });
            queryClient.invalidateQueries({ queryKey: ["llm-routers", id] });
        },
    });
}

export const useDeleteLLMRouter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteLLMRouter(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["llm-routers"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useEmbeddingModels = () => {
    return useQuery({
        queryKey: ["embedding-models"],
        queryFn: () => settingsApi.getEmbeddingModels(),
    });
}

export const useEmbeddingModel = (id?: string) => {
    return useQuery({
        queryKey: ["embedding-models", id],
        queryFn: () => id ? settingsApi.getEmbeddingModel(id) : Promise.reject("No ID provided"),
        enabled: !!id,
    });
}

export const useCreateEmbeddingModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<EmbeddingModel, "id" | "created_at" | "updated_at">) => settingsApi.createEmbeddingModel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["embedding-models"] });
        },
    });
}

export const useUpdateEmbeddingModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<EmbeddingModel> }) => settingsApi.updateEmbeddingModel(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["embedding-models"] });
            queryClient.invalidateQueries({ queryKey: ["embedding-models", id] });
        },
    });
}

export const useDeleteEmbeddingModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteEmbeddingModel(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["embedding-models"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useChunkingStrategies = () => {
    return useQuery({
        queryKey: ["chunking-strategies"],
        queryFn: () => settingsApi.getChunkingStrategies(),
    });
}

export const useChunkingStrategy = (id?: string) => {
    return useQuery({
        queryKey: ["chunking-strategies", id],
        queryFn: () => id ? settingsApi.getChunkingStrategy(id) : Promise.reject("No ID provided"),
        enabled: !!id,
    });
}

export const useCreateChunkingStrategy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: Omit<ChunkingStrategy, "id" | "created_at" | "updated_at">) => settingsApi.createChunkingStrategy(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chunking-strategies"] });
        },
    });
}

export const useUpdateChunkingStrategy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<ChunkingStrategy> }) => settingsApi.updateChunkingStrategy(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["chunking-strategies"] });
            queryClient.invalidateQueries({ queryKey: ["chunking-strategies", id] });
        },
    });
}

export const useSimulateChunking = () => {
    return useMutation({
        mutationFn: (params: Record<string, unknown>) => settingsApi.simulateChunking(params),
    });
}

export const useDeleteChunkingStrategy = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteChunkingStrategy(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["chunking-strategies"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}

export const useVectorDatabases = () => {
    return useQuery({
        queryKey: ["vector-databases"],
        queryFn: () => settingsApi.getVectorDatabases(),
    });
}

export const useDeleteVectorDatabase = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteVectorDatabase(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["vector-databases"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
}
