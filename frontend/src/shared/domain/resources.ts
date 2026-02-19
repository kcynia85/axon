import { z } from "zod";

export const ServiceCategorySchema = z.enum(["Utility", "GenAI", "Scraping", "Business"]);
export const ToolCategorySchema = z.enum(["Primeval", "AI_Utils", "Local", "Systems"]);
export const AutomationPlatformSchema = z.enum(["n8n", "Zapier", "Make", "Custom"]);
export const ValidationStatusSchema = z.enum(["Valid", "Invalid", "Untested"]);

export const PromptArchetypeSchema = z.object({
    id: z.string().uuid(),
    archetype_name: z.string(),
    archetype_description: z.string().nullable().optional(),
    archetype_role: z.string(),
    archetype_goal: z.string(),
    archetype_backstory: z.string(),
    archetype_guardrails: z.object({
        instructions: z.array(z.string()),
        constraints: z.array(z.string()),
    }),
    archetype_knowledge_hubs: z.array(z.any()).nullable().optional(),
    archetype_keywords: z.array(z.string()).default([]),
    workspace_domain: z.string(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type PromptArchetype = z.infer<typeof PromptArchetypeSchema>;

export const ExternalServiceSchema = z.object({
    id: z.string().uuid(),
    service_name: z.string(),
    service_category: ServiceCategorySchema,
    service_url: z.string().url(),
    service_keywords: z.array(z.string()).default([]),
    availability_workspace: z.array(z.string()).default([]),
    capabilities: z.array(z.string()).default([]),
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
    availability_workspace: z.array(z.string()).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type InternalTool = z.infer<typeof InternalToolSchema>;

export const AutomationSchema = z.object({
    id: z.string().uuid(),
    automation_name: z.string(),
    automation_description: z.string().nullable().optional(),
    automation_platform: AutomationPlatformSchema,
    automation_webhook_url: z.string().url(),
    automation_http_method: z.enum(["GET", "POST", "PUT"]),
    automation_auth_config: z.record(z.any()).nullable().optional(),
    automation_input_schema: z.record(z.any()).nullable().optional(),
    automation_output_schema: z.record(z.any()).nullable().optional(),
    automation_validation_status: ValidationStatusSchema,
    automation_last_validated_at: z.string().datetime().nullable().optional(),
    automation_keywords: z.array(z.string()).default([]),
    availability_workspace: z.array(z.string()).default([]),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
});

export type Automation = z.infer<typeof AutomationSchema>;
