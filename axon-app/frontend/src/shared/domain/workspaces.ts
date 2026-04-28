import { z } from "zod";

// --- Enums to match Backend ---
export const ProcessTypeSchema = z.enum(["Sequential", "Hierarchical", "Parallel"]);
export const AutomationPlatformSchema = z.enum(["n8n", "Zapier", "Make", "Custom"]);
export const ValidationStatusSchema = z.enum(["Valid", "Invalid", "Untested"]);

// --- Domain Entities ---

export const DataInterfaceItemSchema = z.object({
  name: z.string(),
  field_type: z.string(),
  is_required: z.boolean().default(true),
  value: z.string().optional().nullable()
});

export const DataInterfaceSchema = z.object({
  context: z.array(DataInterfaceItemSchema).default([]),
  artefacts: z.array(DataInterfaceItemSchema).default([])
});

export const AgentSchema = z.object({
  id: z.string(),
  agent_name: z.string().nullable(),
  agent_role_text: z.string().nullable(),
  agent_goal: z.string().nullable(),
  agent_backstory: z.string().nullable(),
  guardrails: z.object({
    instructions: z.array(z.string()),
    constraints: z.array(z.string()),
  }).default({ instructions: [], constraints: [] }),
  few_shot_examples: z.array(z.record(z.any())).default([]),
  reflexion: z.boolean().default(false),
  temperature: z.number().min(0).max(2).default(0.7),
  rag_enforcement: z.boolean().default(false),
  input_schema: z.record(z.unknown()).nullable().optional(),
  output_schema: z.record(z.unknown()).nullable().optional(),
  availability_workspace: z.array(z.string()).default([]),
  agent_keywords: z.array(z.string()).default([]),
  llm_model_id: z.string().uuid().nullable().optional(),
  knowledge_hub_ids: z.array(z.string().uuid()).nullable().optional(),
  
  // vNext+ Fields (Extended UI configuration)
  agent_visual_url: z.string().nullable().optional(),
  auto_start: z.boolean().default(false),
  grounded_mode: z.boolean().default(false),
  native_skills: z.array(z.string()).default([]),
  custom_functions: z.array(z.string()).default([]),
  tools: z.array(z.string()).optional().nullable(),
  data_interface: DataInterfaceSchema.default({ context: [], artefacts: [] }),

  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const ResolvedMemberSchema = z.object({
  id: z.string(),
  role: z.string(),
  visualUrl: z.string().nullable().optional()
});

export const CrewSchema = z.object({
  id: z.string(),
  crew_name: z.string(),
  crew_description: z.string().nullable().optional(),
  crew_process_type: ProcessTypeSchema,
  manager_agent_id: z.string().nullable().optional(),
  crew_keywords: z.array(z.string()).default([]),
  availability_workspace: z.array(z.string()).default([]),
  agent_member_ids: z.array(z.string()).default([]),
  resolved_members: z.array(ResolvedMemberSchema).default([]),
  resolved_manager: ResolvedMemberSchema.nullable().optional(),
  data_interface: DataInterfaceSchema.default({ context: [], artefacts: [] }),
  metadata: z.record(z.any()).optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Crew = z.infer<typeof CrewSchema>;

export const PatternSchema = z.object({
  id: z.string(),
  pattern_name: z.string(),
  pattern_okr_context: z.string().nullable().optional(),
  pattern_graph_structure: z.record(z.unknown()),
  pattern_inputs: z.record(z.string()).default({}),
  pattern_outputs: z.record(z.string()).default({}),
  pattern_keywords: z.array(z.string()).default([]),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Pattern = z.infer<typeof PatternSchema>;

export const TemplateSchema = z.object({
  id: z.string(),
  template_name: z.string(),
  template_description: z.string().nullable().optional(),
  template_markdown_content: z.string(),
  template_checklist_items: z.array(z.object({
    id: z.string(),
    label: z.string(),
    description: z.string().optional(),
    isCompleted: z.boolean().default(false),
    subactions: z.array(z.object({
      id: z.string(),
      label: z.string(),
      isCompleted: z.boolean().default(false)
    })).optional()
  })).default([]),
  template_keywords: z.array(z.string()).default([]),
  // Deterministic I/O — configured in Workspaces, consumed by Space canvas
  template_inputs: z.array(z.object({
    id: z.string(),
    label: z.string(),
    expectedType: z.enum(['link', 'text', 'file', 'json', 'csv', 'zip', 'image', 'any', 'string']).default('any'),
    isRequired: z.boolean().default(true)
  })).default([]),
  template_outputs: z.array(z.object({
    id: z.string(),
    label: z.string(),
    outputType: z.enum(['link', 'text', 'file', 'any']).default('any'),
    isRequired: z.boolean().default(true)
  })).default([]),
  availability_workspace: z.array(z.string()).default([]),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Template = z.infer<typeof TemplateSchema>;

export const WorkspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  created_at: z.string().datetime().nullable().optional(),
  updated_at: z.string().datetime().nullable().optional(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

/**
 * AutomationSchema: Operational rules in a workspace.
 */
export const AutomationSchema = z.object({
    id: z.string(),
    automation_name: z.string(),
    automation_description: z.string().nullable().optional(),
    automation_platform: z.string().nullable().optional().default("n8n"),
    automation_status: z.string().nullable().optional().default("Draft"),
    automation_webhook_url: z.string().nullable().optional(),
    automation_http_method: z.string().nullable().optional().default("POST"),
    automation_provider_id: z.string().nullable().optional(),
    automation_auth_config: z.record(z.any()).nullable().optional(),
    automation_input_schema: z.record(z.any()).nullable().optional(),
    automation_output_schema: z.record(z.any()).nullable().optional(),
    automation_validation_status: z.string().nullable().optional().default("Untested"),
    automation_last_validated_at: z.string().nullable().optional(),
    automation_keywords: z.array(z.string()).nullable().optional().default([]),
    availability_workspace: z.array(z.string()).nullable().optional().default([]),
    trigger_type: z.string().nullable().optional().default("manual"),
    trigger_config: z.record(z.any()).nullable().optional().default({}),
    steps: z.array(z.any()).nullable().optional().default([]),
    created_at: z.string().nullable().optional(),
    updated_at: z.string().nullable().optional(),
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

export const TrashItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  deleted_at: z.string().datetime(),
  workspace_id: z.string().optional().nullable(),
});

export type TrashItem = z.infer<typeof TrashItemSchema>;
