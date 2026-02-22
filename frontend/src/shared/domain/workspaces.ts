import { z } from "zod";

// --- Enums to match Backend ---
export const PatternTypeSchema = z.enum(["Pattern", "Reusable Template"]);
export const ProcessTypeSchema = z.enum(["Sequential", "Hierarchical", "Parallel"]);

// --- Domain Entities ---

export const AgentSchema = z.object({
  id: z.string().uuid(),
  agent_name: z.string().nullable(),
  agent_role_text: z.string().nullable(),
  agent_goal: z.string().nullable(),
  agent_backstory: z.string().nullable(),
  guardrails: z.object({
    instructions: z.array(z.string()),
    constraints: z.array(z.string()),
  }).default({ instructions: [], constraints: [] }),
  few_shot_examples: z.array(z.unknown()).default([]),
  reflexion: z.boolean().default(false),
  temperature: z.number().min(0).max(2).default(0.7),
  rag_enforcement: z.boolean().default(false),
  input_schema: z.record(z.unknown()).nullable().optional(),
  output_schema: z.record(z.unknown()).nullable().optional(),
  availability_workspace: z.array(z.string()).default([]),
  agent_keywords: z.array(z.string()).default([]),
  llm_model_id: z.string().uuid().nullable().optional(),
  knowledge_hub_ids: z.array(z.string().uuid()).nullable().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const CrewSchema = z.object({
  id: z.string().uuid(),
  crew_name: z.string(),
  crew_description: z.string().nullable().optional(),
  crew_process_type: ProcessTypeSchema,
  manager_agent_id: z.string().uuid().nullable().optional(),
  crew_keywords: z.array(z.string()).default([]),
  availability_workspace: z.array(z.string()).default([]),
  agent_member_ids: z.array(z.string().uuid()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Crew = z.infer<typeof CrewSchema>;

export const PatternSchema = z.object({
  id: z.string().uuid(),
  pattern_name: z.string(),
  pattern_type: PatternTypeSchema,
  pattern_okr_context: z.string().nullable().optional(),
  pattern_graph_structure: z.record(z.unknown()),
  pattern_keywords: z.array(z.string()).default([]),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Pattern = z.infer<typeof PatternSchema>;

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  template_name: z.string(),
  template_description: z.string().nullable().optional(),
  template_markdown_content: z.string(),
  template_checklist_items: z.array(z.record(z.unknown())).default([]),
  template_keywords: z.array(z.string()).default([]),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Template = z.infer<typeof TemplateSchema>;

// === New Entities for vNext ===

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  service_name: z.string(),
  service_description: z.string().nullable().optional(),
  service_category: z.string(),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Service = z.infer<typeof ServiceSchema>;

export const AutomationSchema = z.object({
  id: z.string().uuid(),
  automation_name: z.string(),
  automation_description: z.string().nullable().optional(),
  automation_platform: z.string(),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Automation = z.infer<typeof AutomationSchema>;

export const CostEstimateSchema = z.object({
  staticCost: z.number(),
  dynamicCost: z.number(),
  totalEstimate: z.number(),
  breakdown: z.object({
    agentSetup: z.number(),
    ragUsage: z.number(),
    toolCalls: z.number(),
    inputTokens: z.number(),
    outputTokens: z.number(),
  }),
  suggestions: z.array(z.string()).optional(),
});

export type CostEstimate = z.infer<typeof CostEstimateSchema>;
