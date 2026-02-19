import { apiClient } from "@/shared/lib/api-client/config";
import {
  Agent,
  Crew,
  Pattern,
  Template,
  AgentSchema,
  CrewSchema,
  PatternSchema,
  TemplateSchema,
  Workspace,
  Service,
  Automation,
  WorkspaceSchema,
  ServiceSchema,
  AutomationSchema
} from "@/shared/domain/workspaces";
import { mockApi } from "./mock-api";

// Set to false to use real backend
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const workspacesApi = {
  // --- Workspaces ---
  getWorkspaces: async (): Promise<Workspace[]> => {
    if (USE_MOCK) return mockApi.getWorkspaces();
    const res = await apiClient.get("/workspaces/");
    const data = await res.json() as unknown[];
    return data.map((w) => WorkspaceSchema.parse(w));
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    if (USE_MOCK) return mockApi.getWorkspace(id).then(w => w!);
    const res = await apiClient.get(`/workspaces/${id}`);
    const data = await res.json();
    return WorkspaceSchema.parse(data);
  },

  // --- Agents ---
  getAgents: async (workspaceId: string): Promise<Agent[]> => {
    if (USE_MOCK) return mockApi.getAgents(workspaceId);
    const res = await apiClient.get(`/agents/?workspace=${workspaceId}`);
    const data = await res.json() as unknown[];
    return data.map((a) => AgentSchema.parse(a));
  },

  createAgent: async (agent: Partial<Agent>): Promise<Agent> => {
    const res = await apiClient.post("/agents/", agent);
    const data = await res.json();
    return AgentSchema.parse(data);
  },

  updateAgent: async (id: string, agent: Partial<Agent>): Promise<Agent> => {
    const res = await apiClient.put(`/agents/${id}`, agent);
    const data = await res.json();
    return AgentSchema.parse(data);
  },

  deleteAgent: async (id: string): Promise<void> => {
    await apiClient.delete(`/agents/${id}`);
  },

  // --- Crews ---
  getCrews: async (workspaceId: string): Promise<Crew[]> => {
    if (USE_MOCK) return mockApi.getCrews(workspaceId);
    const res = await apiClient.get(`/workspaces/${workspaceId}/crews`);
    const data = await res.json() as unknown[];
    return data.map((c) => CrewSchema.parse(c));
  },

  createCrew: async (workspaceId: string, crew: Omit<Crew, "id" | "created_at" | "updated_at">): Promise<Crew> => {
    const res = await apiClient.post(`/workspaces/${workspaceId}/crews`, crew);
    const data = await res.json() as unknown;
    return CrewSchema.parse(data);
  },

  updateCrew: async (workspaceId: string, crewId: string, crew: Partial<Crew>): Promise<Crew> => {
    const res = await apiClient.put(`/workspaces/${workspaceId}/crews/${crewId}`, crew);
    const data = await res.json() as unknown;
    return CrewSchema.parse(data);
  },

  deleteCrew: async (workspaceId: string, crewId: string): Promise<void> => {
    await apiClient.delete(`/workspaces/${workspaceId}/crews/${crewId}`);
  },

  // --- Patterns ---
  getPatterns: async (workspaceId: string): Promise<Pattern[]> => {
    if (USE_MOCK) return mockApi.getPatterns(workspaceId);
    const res = await apiClient.get(`/workspaces/${workspaceId}/patterns`);
    const data = await res.json() as unknown[];
    return data.map((p) => PatternSchema.parse(p));
  },

  createPattern: async (workspaceId: string, pattern: Omit<Pattern, "id" | "created_at" | "updated_at">): Promise<Pattern> => {
    const res = await apiClient.post(`/workspaces/${workspaceId}/patterns`, pattern);
    const data = await res.json() as unknown;
    return PatternSchema.parse(data);
  },

  // --- Templates ---
  getTemplates: async (workspaceId: string): Promise<Template[]> => {
    if (USE_MOCK) return mockApi.getTemplates(workspaceId);
    const res = await apiClient.get(`/workspaces/${workspaceId}/templates`);
    const data = await res.json() as unknown[];
    return data.map((t) => TemplateSchema.parse(t));
  },

  createTemplate: async (workspaceId: string, template: Omit<Template, "id" | "created_at" | "updated_at">): Promise<Template> => {
    const res = await apiClient.post(`/workspaces/${workspaceId}/templates`, template);
    const data = await res.json() as unknown;
    return TemplateSchema.parse(data);
  },

  // --- Services ---
  getServices: async (workspaceId: string): Promise<Service[]> => {
    if (USE_MOCK) return mockApi.getServices(workspaceId);
    const res = await apiClient.get(`/workspaces/${workspaceId}/services`);
    const data = await res.json() as unknown[];
    return data.map((s) => ServiceSchema.parse(s));
  },

  // --- Automations ---
  getAutomations: async (workspaceId: string): Promise<Automation[]> => {
    if (USE_MOCK) return mockApi.getAutomations(workspaceId);
    const res = await apiClient.get(`/workspaces/${workspaceId}/automations`);
    const data = await res.json() as unknown[];
    return data.map((a) => AutomationSchema.parse(a));
  }
};
