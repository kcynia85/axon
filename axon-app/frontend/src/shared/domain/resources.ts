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
