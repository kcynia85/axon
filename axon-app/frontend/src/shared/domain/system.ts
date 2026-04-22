import { z } from "zod";

export const SystemEmbeddingSchema = z.object({
    id: z.string().uuid(),
    entity_id: z.string().uuid(),
    entity_type: z.string(),
    payload: z.record(z.any()),
    updated_at: z.string().optional().nullable(),
});

export type SystemEmbedding = z.infer<typeof SystemEmbeddingSchema>;

export const MetaAgentSchema = z.object({
    id: z.string().uuid(),
    meta_agent_system_prompt: z.string(),
    meta_agent_temperature: z.number().default(0.7),
    meta_agent_rag_enabled: z.boolean().default(true),
    meta_agent_system_knowledge_rags: z.array(z.record(z.any())).default([]),
    llm_model_id: z.string().uuid().optional().nullable(),
});

export type MetaAgent = z.infer<typeof MetaAgentSchema>;

export const SystemAwarenessSettingsSchema = z.object({
    id: z.string().uuid(),
    embedding_model_id: z.string().uuid().optional().nullable(),
    indexing_enabled: z.boolean().default(true),
    realtime_sync_enabled: z.boolean().default(true),
});

export type SystemAwarenessSettings = z.infer<typeof SystemAwarenessSettingsSchema>;

