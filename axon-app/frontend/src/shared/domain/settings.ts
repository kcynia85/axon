import { z } from "zod";

export const ModelTierSchema = z.enum(["Tier1", "Tier2", "TIER1", "TIER2"]);
export const ChunkingMethodSchema = z.enum(["Recursive_Character", "Code_Splitter", "Token_Splitter", "RECURSIVE_CHARACTER", "CODE_SPLITTER", "TOKEN_SPLITTER"]);

export const LLMProviderSchema = z.object({
    id: z.string().uuid(),
    provider_name: z.string(),
    provider_api_key_required: z.boolean(),
    provider_api_endpoint: z.string().url().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const LLMModelSchema = z.object({
    id: z.string().uuid(),
    model_id: z.string(),
    model_display_name: z.string(),
    model_tier: ModelTierSchema,
    model_capabilities_flags: z.array(z.string()).default([]),
    model_context_window: z.number().int(),
    model_supports_thinking: z.boolean().default(false),
    model_pricing_config: z.record(z.any()),
    llm_provider_id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type LLMModel = z.infer<typeof LLMModelSchema>;

export const LLMRouterSchema = z.object({
    id: z.string().uuid(),
    router_alias: z.string(),
    router_strategy: z.enum(["Cost_Optimized", "Speed_Optimized", "Quality_Optimized", "COST_OPTIMIZED", "SPEED_OPTIMIZED", "QUALITY_OPTIMIZED"]),
    router_max_tokens_threshold: z.number().int().nullable().optional(),
    router_cost_limit_per_request: z.number().nullable().optional(),
    primary_model_id: z.string().uuid(),
    fallback_model_id: z.string().uuid().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type LLMRouter = z.infer<typeof LLMRouterSchema>;

export const EmbeddingModelSchema = z.object({
    id: z.string().uuid(),
    model_provider_name: z.string(),
    model_id: z.string(),
    model_vector_dimensions: z.number().int(),
    model_max_context_tokens: z.number().int(),
    model_cost_per_1m_tokens: z.number(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type EmbeddingModel = z.infer<typeof EmbeddingModelSchema>;

export const ChunkingStrategySchema = z.object({
    id: z.string().uuid(),
    strategy_name: z.string(),
    strategy_chunking_method: ChunkingMethodSchema,
    strategy_chunk_size: z.number().int(),
    strategy_chunk_overlap: z.number().int(),
    strategy_chunk_boundaries: z.record(z.any()).default({}),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type ChunkingStrategy = z.infer<typeof ChunkingStrategySchema>;

export const VectorDatabaseSchema = z.object({
    id: z.string().uuid(),
    vector_database_name: z.string(),
    vector_database_type: z.enum(["Postgres_pgvector", "ChromaDB", "Pinecone", "POSTGRES_PGVECTOR", "CHROMADB", "PINECONE"]),
    vector_database_connection_url: z.string().nullable().optional(),
    vector_database_connection_string: z.string().nullable().optional(),
    vector_database_index_method: z.enum(["HNSW", "IVFFLAT"]),
    vector_database_connection_status: z.enum(["Connected", "Disconnected", "CONNECTED", "DISCONNECTED"]),
    vector_database_collection_name: z.string(),
    vector_database_embedding_model_reference: z.string(),
    vector_database_total_vectors: z.number().int().optional(),
    vector_database_size: z.number().optional(),
    vector_database_expected_dimensions: z.number().int(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type VectorDatabase = z.infer<typeof VectorDatabaseSchema>;
