import { z } from "zod";

export const ModelTierSchema = z.enum(["Tier1", "Tier2", "TIER1", "TIER2"]);
export const ChunkingMethodSchema = z.enum([
    "Recursive_Character", 
    "Character",
    "Code_Splitter", 
    "Token_Splitter",
    "Markdown",
    "HTML",
    "LaTeX",
    "JSON",
    "Semantic",
    "RECURSIVE_CHARACTER", 
    "CHARACTER",
    "CODE_SPLITTER", 
    "TOKEN_SPLITTER",
    "MARKDOWN",
    "HTML_SPLITTER",
    "LATEX",
    "JSON_SPLITTER",
    "SEMANTIC"
]);

export const LLMProviderSchema = z.object({
    id: z.string().uuid(),
    provider_name: z.string(),
    provider_technical_id: z.string(),
    provider_type: z.enum(["cloud", "meta", "local"]),
    provider_api_key: z.string().nullable().optional(),
    provider_api_key_required: z.boolean(),
    provider_api_endpoint: z.string().nullable().optional(),
    
    // Core Agnostic Configuration
    protocol: z.string().default("openai"),
    inference_path: z.string().nullable().optional(),
    inference_json_template: z.string().nullable().optional(),
    custom_headers: z.array(z.object({
        key: z.string(),
        value: z.string()
    })).default([]),
    
    // Discovery & Auth (SSoT)
    auth_header_name: z.string().nullable().optional().default("Authorization"),
    auth_header_prefix: z.string().nullable().optional().default("Bearer "),
    api_key_placement: z.enum(["header", "query"]).default("header"),
    discovery_json_path: z.string().nullable().optional().default("data"),
    discovery_id_key: z.string().nullable().optional().default("id"),
    discovery_name_key: z.string().nullable().optional().default("name"),
    discovery_context_key: z.string().nullable().optional().default("context_length"),
    discovery_pricing_endpoint: z.string().nullable().optional(),
    discovery_pricing_input_key: z.string().nullable().optional(),
    discovery_pricing_output_key: z.string().nullable().optional(),

    // Algorithmic Scraping Configuration
    pricing_page_url: z.string().nullable().optional(),
    pricing_scraper_strategy: z.string().default("auto"),
    pricing_last_synced_at: z.string().datetime().nullable().optional(),
    pricing_data_cache: z.record(z.any()).nullable().optional(),
    
    // Response Mapping
    response_content_path: z.string().nullable().optional().default("choices.0.message.content"),
    response_error_path: z.string().nullable().optional().default("error.message"),

    provider_custom_config: z.record(z.any()).nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export type LLMProvider = z.infer<typeof LLMProviderSchema>;

export const LLMModelSchema = z.object({
    id: z.string().uuid(),
    model_id: z.string(),
    model_display_name: z.string(),
    model_tier: ModelTierSchema,
    model_capabilities_flags: z.array(z.string()).nullable().optional().default([]),
    model_context_window: z.number().int().default(4096),
    model_supports_thinking: z.boolean().nullable().optional().default(false),
    model_reasoning_effort: z.string().nullable().optional(),
    model_system_prompt: z.string().nullable().optional(),
    model_custom_params: z.array(z.record(z.any())).nullable().optional().default([]),
    model_pricing_config: z.record(z.any()).nullable().optional().default({}),
    is_available: z.boolean().nullable().optional().default(true),
    llm_provider_id: z.string().uuid(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export type LLMModel = z.infer<typeof LLMModelSchema>;

export const LLMRouterSchema = z.object({
    id: z.string().uuid(),
    router_alias: z.string(),
    router_strategy: z.enum([
        "Cost_Optimized", "Speed_Optimized", "Quality_Optimized", 
        "COST_OPTIMIZED", "SPEED_OPTIMIZED", "QUALITY_OPTIMIZED",
        "Fallback", "Load_Balancer", "FALLBACK", "LOAD_BALANCER"
    ]),
    router_max_tokens_threshold: z.number().int().nullable().optional(),
    router_cost_limit_per_request: z.number().nullable().optional(),
    primary_model_id: z.string().uuid().nullable().optional(),
    fallback_model_id: z.string().uuid().nullable().optional(),
    priority_chain: z.array(z.record(z.any())).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export type LLMRouter = z.infer<typeof LLMRouterSchema>;

export const EmbeddingModelSchema = z.object({
    id: z.string().uuid(),
    model_provider_name: z.string(),
    model_id: z.string(),
    model_vector_dimensions: z.number().int(),
    model_max_context_tokens: z.number().int(),
    model_cost_per_1m_tokens: z.number(),
    is_draft: z.boolean().default(false),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export type EmbeddingModel = z.infer<typeof EmbeddingModelSchema>;

export const ChunkingStrategySchema = z.object({
    id: z.string().uuid(),
    strategy_name: z.string(),
    strategy_chunking_method: ChunkingMethodSchema,
    strategy_chunk_size: z.number().int(),
    strategy_chunk_overlap: z.number().int(),
    strategy_chunk_boundaries: z.record(z.any()).default({}),
    is_draft: z.boolean().default(false),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export type ChunkingStrategy = z.infer<typeof ChunkingStrategySchema>;

export const VectorDatabaseSchema = z.object({
    id: z.string().uuid(),
    vector_database_name: z.string(),
    vector_database_type: z.enum([
        "POSTGRES_PGVECTOR_LOCAL",
        "SUPABASE_PGVECTOR_CLOUD",
        "QDRANT_LOCAL",
        "CHROMADB_CLOUD",
        "CHROMADB_LOCAL",
        "Postgres_pgvector_Local",
        "Supabase_pgvector_Cloud",
        "Qdrant_Local",
        "ChromaDB_Cloud",
        "ChromaDB_Local",
        "Postgres_pgvector",
        "ChromaDB",
        "Pinecone",
        "POSTGRES_PGVECTOR",
        "CHROMADB",
        "PINECONE"
    ]),
    vector_database_host: z.string().nullable().optional(),
    vector_database_port: z.number().int().optional(),
    vector_database_user: z.string().nullable().optional(),
    vector_database_password: z.string().nullable().optional(),
    vector_database_db_name: z.string().nullable().optional(),
    vector_database_ssl_mode: z.string().nullable().optional(),
    vector_database_config: z.record(z.any()).optional(),
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
    deleted_at: z.string().datetime().nullable().optional(),
});

export type VectorDatabase = z.infer<typeof VectorDatabaseSchema>;
