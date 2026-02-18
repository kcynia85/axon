import { z } from "zod";

// --- Domain Entities (Value Objects) ---

export const AgentSchema = z.object({
  id: z.string().uuid(),
  role: z.string(),
  goal: z.string(),
  backstory: z.string().optional(),
  keywords: z.array(z.string()).optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const CrewSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  process: z.enum(["sequential", "hierarchical"]),
  agents: z.array(z.string().uuid()), // List of Agent IDs
});

export type Crew = z.infer<typeof CrewSchema>;

export const WorkspaceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

export const PatternSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(["architecture", "behavior", "workflow"]),
  content: z.string(), // JSON or YAML content
});
export type Pattern = z.infer<typeof PatternSchema>;

export const TemplateSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().optional(),
  category: z.string(),
  tags: z.array(z.string()),
});
export type Template = z.infer<typeof TemplateSchema>;

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  url: z.string(),
  category: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  capabilities: z.array(z.string()).optional(),
  workspaces: z.array(z.string()).optional(),
  authType: z.enum(["bearer", "api-key", "none"]),
  status: z.enum(["active", "inactive", "error"]),
});
export type Service = z.infer<typeof ServiceSchema>;

export const AutomationSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.string().default("Gotowy"),
  description: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  context: z.array(z.object({ name: z.string(), type: z.string() })).optional(),
  artefacts: z.array(z.object({ name: z.string(), type: z.string() })).optional(),
  workspaces: z.array(z.string()).optional(),
  trigger: z.string(),
  enabled: z.boolean(),
  lastRun: z.string().datetime().optional(),
});
export type Automation = z.infer<typeof AutomationSchema>;

// --- API Contracts (DTOs) ---

export const CreateWorkspaceSchema = WorkspaceSchema.pick({ name: true, description: true });
export type CreateWorkspaceDTO = z.infer<typeof CreateWorkspaceSchema>;

export const CreateAgentSchema = AgentSchema.omit({ id: true });
export type CreateAgentDTO = z.infer<typeof CreateAgentSchema>;
