import { apiClient } from "@/shared/lib/api-client/config";
import {
    LLMProvider,
    LLMModel,
    LLMRouter,
    EmbeddingModel,
    ChunkingStrategy,
    VectorDatabase,
    LLMProviderSchema,
    LLMModelSchema,
    LLMRouterSchema,
    EmbeddingModelSchema,
    ChunkingStrategySchema,
    VectorDatabaseSchema
} from "@/shared/domain/settings";

export const settingsApi = {
    // --- LLM Providers ---
    getLLMProviders: async (): Promise<LLMProvider[]> => {
        const res = await apiClient.get("/settings/llm-providers");
        const data = await res.json() as unknown[];
        return data.map((providerRaw) => LLMProviderSchema.parse(providerRaw));
    },

    createLLMProvider: async (provider: Omit<LLMProvider, "id" | "created_at" | "updated_at">): Promise<LLMProvider> => {
        const res = await apiClient.post("/settings/llm-providers", provider);
        const data = await res.json() as unknown;
        return LLMProviderSchema.parse(data);
    },

    updateLLMProvider: async (id: string, provider: Partial<LLMProvider>): Promise<LLMProvider> => {
        const res = await apiClient.patch(`/settings/llm-providers/${id}`, provider);
        const data = await res.json() as unknown;
        return LLMProviderSchema.parse(data);
    },

    deleteLLMProvider: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/llm-providers/${id}`);
    },

    // --- LLM Models ---
    getLLMModels: async (): Promise<LLMModel[]> => {
        const res = await apiClient.get("/settings/llm-models");
        const data = await res.json() as unknown[];
        return data.map((modelRaw) => LLMModelSchema.parse(modelRaw));
    },

    createLLMModel: async (model: Omit<LLMModel, "id" | "created_at" | "updated_at">): Promise<LLMModel> => {
        const res = await apiClient.post("/settings/llm-models", model);
        const data = await res.json() as unknown;
        return LLMModelSchema.parse(data);
    },

    updateLLMModel: async (id: string, model: Partial<LLMModel>): Promise<LLMModel> => {
        const res = await apiClient.patch(`/settings/llm-models/${id}`, model);
        const data = await res.json() as unknown;
        return LLMModelSchema.parse(data);
    },

    deleteLLMModel: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/llm-models/${id}`);
    },

    // --- LLM Routers ---
    getLLMRouters: async (): Promise<LLMRouter[]> => {
        const res = await apiClient.get("/settings/llm-routers");
        const data = await res.json() as unknown[];
        return data.map((routerRaw) => LLMRouterSchema.parse(routerRaw));
    },

    createLLMRouter: async (router: Omit<LLMRouter, "id" | "created_at" | "updated_at">): Promise<LLMRouter> => {
        const res = await apiClient.post("/settings/llm-routers", router);
        const data = await res.json() as unknown;
        return LLMRouterSchema.parse(data);
    },

    updateLLMRouter: async (id: string, router: Partial<LLMRouter>): Promise<LLMRouter> => {
        const res = await apiClient.patch(`/settings/llm-routers/${id}`, router);
        const data = await res.json() as unknown;
        return LLMRouterSchema.parse(data);
    },

    deleteLLMRouter: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/llm-routers/${id}`);
    },

    testRouter: async (id: string, prompt: string): Promise<unknown> => {
        const res = await apiClient.post(`/settings/llm-routers/${id}/test`, { prompt });
        return await res.json() as unknown;
    },

    // --- Embedding Models ---
    getEmbeddingModels: async (): Promise<EmbeddingModel[]> => {
        const res = await apiClient.get("/settings/embedding-models");
        const data = await res.json() as unknown[];
        return data.map((embeddingModelRaw) => EmbeddingModelSchema.parse(embeddingModelRaw));
    },

    // --- Chunking Strategies ---
    getChunkingStrategies: async (): Promise<ChunkingStrategy[]> => {
        const res = await apiClient.get("/settings/chunking-strategies");
        const data = await res.json() as unknown[];
        return data.map((chunkingStrategyRaw) => ChunkingStrategySchema.parse(chunkingStrategyRaw));
    },

    simulateChunking: async (params: Record<string, unknown>): Promise<unknown> => {
        const res = await apiClient.post("/settings/chunking-strategies/simulate", params);
        return await res.json() as unknown;
    },

    // --- Vector Databases ---
    getVectorDatabases: async (): Promise<VectorDatabase[]> => {
        const res = await apiClient.get("/settings/vector-databases");
        const data = await res.json() as unknown[];
        return data.map((vectorDatabaseRaw) => VectorDatabaseSchema.parse(vectorDatabaseRaw));
    },

    testVectorDB: async (id: string): Promise<unknown> => {
        const res = await apiClient.post(`/settings/vector-databases/${id}/test`, {});
        return await res.json() as unknown;
    }
};
