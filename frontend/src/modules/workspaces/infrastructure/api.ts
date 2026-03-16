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
  Automation,
  WorkspaceSchema,
  AutomationSchema
} from "@/shared/domain/workspaces";
import { mockApi } from "./mockApi";

// Set to true to use real backend
const USE_MOCK = false;

export const workspacesApi = {
  // --- Workspaces ---
  getWorkspaces: async (limit: number = 100, offset: number = 0): Promise<Workspace[]> => {
    if (USE_MOCK) return mockApi.getWorkspaces(limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/?limit=${limit}&offset=${offset}`);
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
  getAgents: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Agent[]> => {
    if (USE_MOCK) return mockApi.getAgents(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/agents/?workspace=${workspaceId}&limit=${limit}&offset=${offset}`);
    return data.map((agentRaw) => AgentSchema.parse(agentRaw));
  },

  getAgent: async (id: string): Promise<Agent> => {
    if (USE_MOCK) {
      const agent = await mockApi.getAgent(id);
      return agent!;
    }
    const data = await authenticatedClient.get<unknown>(`/agents/${id}`);
    return AgentSchema.parse(data);
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
  getCrews: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Crew[]> => {
    if (USE_MOCK) return mockApi.getCrews(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/crews?limit=${limit}&offset=${offset}`);
    return data.map((crewRaw) => CrewSchema.parse(crewRaw));
  },

  getCrew: async (workspaceId: string, crewId: string): Promise<Crew> => {
    if (USE_MOCK) {
      const crew = await mockApi.getCrew(crewId);
      return crew!;
    }
    const data = await authenticatedClient.get<unknown>(`/workspaces/${workspaceId}/crews/${crewId}`);
    return CrewSchema.parse(data);
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
  getPatterns: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Pattern[]> => {
    if (USE_MOCK) return mockApi.getPatterns(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/patterns?limit=${limit}&offset=${offset}`);
    return data.map((patternRaw) => PatternSchema.parse(patternRaw));
  },

  createPattern: async (workspaceId: string, pattern: Omit<Pattern, "id" | "created_at" | "updated_at">): Promise<Pattern> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/patterns`, pattern);
    return PatternSchema.parse(data);
  },

  // --- Templates ---
  getTemplates: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Template[]> => {
    if (USE_MOCK) return mockApi.getTemplates(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/templates?limit=${limit}&offset=${offset}`);
    return data.map((templateRaw) => TemplateSchema.parse(templateRaw));
  },

  getTemplate: async (workspaceId: string, templateId: string): Promise<Template> => {
    if (USE_MOCK) {
      const template = await mockApi.getTemplate(templateId);
      return template!;
    }
    const data = await authenticatedClient.get<unknown>(`/workspaces/${workspaceId}/templates/${templateId}`);
    return TemplateSchema.parse(data);
  },

  createTemplate: async (workspaceId: string, template: Omit<Template, "id" | "created_at" | "updated_at">): Promise<Template> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/templates`, template);
    return TemplateSchema.parse(data);
  },

  updateTemplate: async (workspaceId: string, templateId: string, template: Partial<Template>): Promise<Template> => {
    const data = await authenticatedClient.put<unknown>(`/workspaces/${workspaceId}/templates/${templateId}`, template);
    return TemplateSchema.parse(data);
  },

  deleteTemplate: async (workspaceId: string, templateId: string): Promise<void> => {
    await authenticatedClient.delete(`/workspaces/${workspaceId}/templates/${templateId}`);
  },

  // --- Automations ---
  getAutomations: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Automation[]> => {
    if (USE_MOCK) return mockApi.getAutomations(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/workspaces/${workspaceId}/automations?limit=${limit}&offset=${offset}`);
    return data.map((automationRaw) => AutomationSchema.parse(automationRaw));
  },

  getAutomation: async (workspaceId: string, automationId: string): Promise<Automation> => {
    if (USE_MOCK) {
      const automation = await mockApi.getAutomation(automationId);
      return automation!;
    }
    const data = await authenticatedClient.get<unknown>(`/workspaces/${workspaceId}/automations/${automationId}`);
    return AutomationSchema.parse(data);
  },

  createAutomation: async (workspaceId: string, automation: Omit<Automation, "id" | "created_at" | "updated_at">): Promise<Automation> => {
    const data = await authenticatedClient.post<unknown>(`/workspaces/${workspaceId}/automations`, automation);
    return AutomationSchema.parse(data);
  },

  updateAutomation: async (workspaceId: string, automationId: string, automation: Partial<Automation>): Promise<Automation> => {
    const data = await authenticatedClient.put<unknown>(`/workspaces/${workspaceId}/automations/${automationId}`, automation);
    return AutomationSchema.parse(data);
  },

  deleteAutomation: async (workspaceId: string, automationId: string): Promise<void> => {
    await authenticatedClient.delete(`/workspaces/${workspaceId}/automations/${automationId}`);
  }
};
