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

    getLLMProvider: async (id: string): Promise<LLMProvider> => {
        const res = await apiClient.get(`/settings/llm-providers/${id}`);
        const data = await res.json() as unknown;
        return LLMProviderSchema.parse(data);
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

    testLLMProvider: async (id: string): Promise<any> => {
        const res = await apiClient.post(`/settings/llm-providers/${id}/test`, {});
        return await res.json();
    },

    syncLLMProviderPricing: async (id: string): Promise<void> => {
        await apiClient.post(`/settings/llm-providers/${id}/sync-pricing`, {});
    },

    getAvailableModels: async (provider_id: string): Promise<any[]> => {
        const res = await apiClient.get(`/settings/llm-providers/${provider_id}/available-models`);
        return await res.json() as any[];
    },

    // --- LLM Models ---
    getLLMModels: async (): Promise<LLMModel[]> => {
        const res = await apiClient.get("/settings/llm-models");
        const data = await res.json() as unknown[];
        return data.map((modelRaw) => LLMModelSchema.parse(modelRaw));
    },

    getLLMModel: async (id: string): Promise<LLMModel> => {
        const res = await apiClient.get(`/settings/llm-models/${id}`);
        const data = await res.json() as unknown;
        return LLMModelSchema.parse(data);
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

    getLLMModelUsage: async (id: string): Promise<{ is_used: bool, used_by: string[] }> => {
        const res = await apiClient.get(`/settings/llm-models/${id}/usage`);
        return await res.json();
    },

    testLLMModel: async (id: string, prompt: string): Promise<unknown> => {
        const res = await apiClient.post(`/settings/llm-models/${id}/test`, { prompt });
        return await res.json() as unknown;
    },

    // --- LLM Routers ---
    getLLMRouters: async (): Promise<LLMRouter[]> => {
        const res = await apiClient.get("/settings/llm-routers");
        const data = await res.json() as unknown[];
        return data.map((routerRaw) => LLMRouterSchema.parse(routerRaw));
    },

    getLLMRouter: async (id: string): Promise<LLMRouter> => {
        const res = await apiClient.get(`/settings/llm-routers/${id}`);
        const data = await res.json() as unknown;
        return LLMRouterSchema.parse(data);
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

    getEmbeddingModel: async (id: string): Promise<EmbeddingModel> => {
        const res = await apiClient.get(`/settings/embedding-models/${id}`);
        const data = await res.json() as unknown;
        return EmbeddingModelSchema.parse(data);
    },

    createEmbeddingModel: async (data: Omit<EmbeddingModel, "id" | "created_at" | "updated_at">): Promise<EmbeddingModel> => {
        const res = await apiClient.post("/settings/embedding-models", data);
        const raw = await res.json();
        return EmbeddingModelSchema.parse(raw);
    },

    updateEmbeddingModel: async (id: string, data: Partial<EmbeddingModel>): Promise<EmbeddingModel> => {
        const res = await apiClient.patch(`/settings/embedding-models/${id}`, data);
        const raw = await res.json();
        return EmbeddingModelSchema.parse(raw);
    },

    deleteEmbeddingModel: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/embedding-models/${id}`);
    },

    // --- Chunking Strategies ---
    getChunkingStrategies: async (): Promise<ChunkingStrategy[]> => {
        const res = await apiClient.get("/settings/chunking-strategies");
        const data = await res.json() as unknown[];
        return data.map((chunkingStrategyRaw) => ChunkingStrategySchema.parse(chunkingStrategyRaw));
    },

    getChunkingStrategy: async (id: string): Promise<ChunkingStrategy> => {
        const res = await apiClient.get(`/settings/chunking-strategies/${id}`);
        const data = await res.json() as unknown;
        return ChunkingStrategySchema.parse(data);
    },

    createChunkingStrategy: async (data: Omit<ChunkingStrategy, "id" | "created_at" | "updated_at">): Promise<ChunkingStrategy> => {
        const res = await apiClient.post("/settings/chunking-strategies", data);
        const raw = await res.json();
        return ChunkingStrategySchema.parse(raw);
    },

    updateChunkingStrategy: async (id: string, data: Partial<ChunkingStrategy>): Promise<ChunkingStrategy> => {
        const res = await apiClient.patch(`/settings/chunking-strategies/${id}`, data);
        const raw = await res.json();
        return ChunkingStrategySchema.parse(raw);
    },

    deleteChunkingStrategy: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/chunking-strategies/${id}`);
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

    getVectorDatabase: async (id: string): Promise<VectorDatabase> => {
        const res = await apiClient.get(`/settings/vector-databases/${id}`);
        const data = await res.json() as unknown;
        return VectorDatabaseSchema.parse(data);
    },

    createVectorDatabase: async (data: Omit<VectorDatabase, "id" | "created_at" | "updated_at">): Promise<VectorDatabase> => {
        const res = await apiClient.post("/settings/vector-databases", data);
        const raw = await res.json();
        return VectorDatabaseSchema.parse(raw);
    },

    updateVectorDatabase: async (id: string, data: Partial<VectorDatabase>): Promise<VectorDatabase> => {
        const res = await apiClient.patch(`/settings/vector-databases/${id}`, data);
        const raw = await res.json();
        return VectorDatabaseSchema.parse(raw);
    },

    deleteVectorDatabase: async (id: string): Promise<void> => {
        await apiClient.delete(`/settings/vector-databases/${id}`);
    },

    testVectorDB: async (id: string): Promise<unknown> => {
        const res = await apiClient.post(`/settings/vector-databases/${id}/test`, {});
        return await res.json() as unknown;
    }
};
