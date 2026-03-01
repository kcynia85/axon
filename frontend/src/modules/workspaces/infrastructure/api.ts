import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";
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
import { mockApi } from "./mockApi";

// Set to false to use real backend
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const workspacesApi = {
  // --- Workspaces ---
  getWorkspaces: async (): Promise<Workspace[]> => {
    if (USE_MOCK) return mockApi.getWorkspaces();
    const data = await authenticatedClient.get<unknown[]>("/workspaces/");
    return data.map((workspaceRaw) => WorkspaceSchema.parse(workspaceRaw));
  },

  getWorkspace: async (id: string): Promise<Workspace> => {
    if (USE_MOCK) {
      const workspace = await mockApi.getWorkspace(id);
      return workspace!;
    }
    const data = await authenticatedClient.get<unknown>(`/workspaces/${id}`);
    return WorkspaceSchema.parse(data);
  },

  // --- Agents ---
  getAgents: async (workspaceId: string): Promise<Agent[]> => {
    if (USE_MOCK) return mockApi.getAgents(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/agents/?workspace=${workspaceId}`);
    return data.map((agentRaw) => AgentSchema.parse(agentRaw));
  },

  createAgent: async (agent: Partial<Agent>): Promise<Agent> => {
    const data = await authenticatedClient.post<unknown>("/agents/", agent);
    return AgentSchema.parse(data);
  },

  updateAgent: async (id: string, agent: Partial<Agent>): Promise<Agent> => {
    const data = await authenticatedClient.put<unknown>(`/agents/${id}`, agent);
    return AgentSchema.parse(data);
  },

  deleteAgent: async (id: string): Promise<void> => {
    await authenticatedClient.delete(`/agents/${id}`);
  },

  // --- Crews ---
  getCrews: async (workspaceId: string): Promise<Crew[]> => {
    if (USE_MOCK) return mockApi.getCrews(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/crews`);
    return data.map((crewRaw) => CrewSchema.parse(crewRaw));
  },

  createCrew: async (workspaceId: string, crew: Omit<Crew, "id" | "created_at" | "updated_at">): Promise<Crew> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/crews`, crew);
    return CrewSchema.parse(data);
  },

  updateCrew: async (workspaceId: string, crewId: string, crew: Partial<Crew>): Promise<Crew> => {
    const data = await authenticatedClient.put<unknown>(`/workspaces/${workspaceId}/crews/${crewId}`, crew);
    return CrewSchema.parse(data);
  },

  deleteCrew: async (workspaceId: string, crewId: string): Promise<void> => {
    await authenticatedClient.delete(`/workspaces/${workspaceId}/crews/${crewId}`);
  },

  // --- Patterns ---
  getPatterns: async (workspaceId: string): Promise<Pattern[]> => {
    if (USE_MOCK) return mockApi.getPatterns(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/patterns`);
    return data.map((patternRaw) => PatternSchema.parse(patternRaw));
  },

  createPattern: async (workspaceId: string, pattern: Omit<Pattern, "id" | "created_at" | "updated_at">): Promise<Pattern> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/patterns`, pattern);
    return CrewSchema.parse(data);
  },

  // --- Templates ---
  getTemplates: async (workspaceId: string): Promise<Template[]> => {
    if (USE_MOCK) return mockApi.getTemplates(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/templates`);
    return data.map((templateRaw) => TemplateSchema.parse(templateRaw));
  },

  createTemplate: async (workspaceId: string, template: Omit<Template, "id" | "created_at" | "updated_at">): Promise<Template> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/templates`, template);
    return TemplateSchema.parse(data);
  },

  // --- Services ---
  getServices: async (workspaceId: string): Promise<Service[]> => {
    if (USE_MOCK) return mockApi.getServices(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/services`);
    return data.map((serviceRaw) => ServiceSchema.parse(serviceRaw));
  },

  // --- Automations ---
  getAutomations: async (workspaceId: string): Promise<Automation[]> => {
    if (USE_MOCK) return mockApi.getAutomations(workspaceId);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/automations`);
    return data.map((automationRaw) => AutomationSchema.parse(automationRaw));
  }
};
