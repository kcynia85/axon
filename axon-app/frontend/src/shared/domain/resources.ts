import { z } from "zod";

export const ServiceCategorySchema = z.enum(["Utility", "GenAI", "Scraping", "Business"]);
export const ToolCategorySchema = z.enum(["Primeval", "AI_Utils", "Local", "Systems"]);
export const ValidationStatusSchema = z.enum(["Valid", "Invalid", "Untested"]);

export const PromptArchetypeSchema = z.object({
    id: z.string(),
    archetype_name: z.string().nullish(),
    archetype_description: z.string().nullish(),
    archetype_role: z.string().nullish(),
    archetype_goal: z.string().nullish(),
    archetype_backstory: z.string().nullish(),
    archetype_guardrails: z.object({
        instructions: z.array(z.string()).default([]),
        constraints: z.array(z.string()).default([]),
    }).nullish(),
    archetype_knowledge_hubs: z.array(z.any()).nullish(),
    archetype_keywords: z.array(z.string()).nullish(),
    workspace_domain: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
}).passthrough();

export type PromptArchetype = z.infer<typeof PromptArchetypeSchema>;

/**
 * ServiceSchema (ExternalService): Global definitions of available external integrations.
 * Used for mapping capabilities in Node Space Canvas.
 */
export const ExternalServiceSchema = z.object({
    id: z.string().uuid(),
    service_name: z.string(),
    service_description: z.string().nullable().optional(),
    service_category: ServiceCategorySchema,
    service_url: z.string().url().optional(),
    service_keywords: z.array(z.string()).default([]),
    availability_workspace: z.array(z.string()).default([]),
    capabilities: z.array(z.object({
        id: z.string().uuid().optional(),
        capability_name: z.string(),
        capability_description: z.string().nullish(),
        method: z.string().optional(),
        path: z.string().optional(),
    })).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type ExternalService = z.infer<typeof ExternalServiceSchema>;

export const InternalToolSchema = z.object({
    id: z.string().uuid(),
    tool_function_name: z.string(),
    tool_display_name: z.string(),
    tool_description: z.string(),
    tool_category: ToolCategorySchema,
    tool_keywords: z.array(z.string()).default([]),
    tool_input_schema: z.record(z.any()),
    tool_output_schema: z.record(z.any()),
    tool_is_active: z.boolean().default(true),
    tool_status: z.string().default("draft"),
    availability_workspace: z.array(z.string()).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type InternalTool = z.infer<typeof InternalToolSchema>;

// --- Knowledge Domain ---

export const KnowledgeHubSchema = z.object({
    id: z.string().uuid(),
    hub_name: z.string(),
    hub_description: z.string().nullable().optional(),
    created_at: z.string().datetime().nullish(),
    updated_at: z.string().datetime().nullish(),
});

export type KnowledgeHub = z.infer<typeof KnowledgeHubSchema>;

export const KnowledgeResourceStatusSchema = z.enum(["Pending", "Indexing", "Ready", "Error", "PENDING", "INDEXING", "READY", "ERROR"]);

export const KnowledgeResourceSchema = z.object({
    id: z.string().uuid(),
    resource_file_name: z.string(),
    resource_file_format: z.string(),
    resource_file_size_bytes: z.number().int(),
    resource_metadata: z.record(z.any()).default({}),
    resource_rag_indexing_status: KnowledgeResourceStatusSchema,
    resource_indexing_error: z.string().nullable().optional(),
    resource_chunk_count: z.number().int().default(0),
    knowledge_hub_id: z.string().uuid().nullable().optional(),
    vector_database_id: z.string().uuid().nullable().optional(),
    created_at: z.string().datetime().nullish(),
    updated_at: z.string().datetime().nullish(),
    // UI Helpers (optional in domain, mapped in API or UI)
    hub_name: z.string().optional(),
    vector_database_name: z.string().optional(),
});

export type KnowledgeResource = z.infer<typeof KnowledgeResourceSchema>;

export const TextChunkSchema = z.object({
    id: z.string().uuid(),
    chunk_index: z.number().int(),
    chunk_text: z.string(),
    chunk_metadata: z.record(z.any()).default({}),
    knowledge_resource_id: z.string().uuid(),
    created_at: z.string().datetime(),
});

export type TextChunk = z.infer<typeof TextChunkSchema>;
