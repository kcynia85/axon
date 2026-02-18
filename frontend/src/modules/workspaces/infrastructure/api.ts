import { mockApi } from "./mock-api";
import { 
  Workspace, 
  Agent, 
  Crew, 
  Pattern, 
  Template, 
  Service, 
  Automation 
} from "@/shared/domain/workspaces";

// TODO: Implement real API client using fetch/axios
// For now, we export the mock as the "real" implementation to unblock UI dev.

const USE_MOCK = true;

export const workspacesApi = {
  getWorkspaces: async (): Promise<Workspace[]> => {
    if (USE_MOCK) return mockApi.getWorkspaces();
    throw new Error("Not implemented");
  },

  getWorkspace: async (id: string): Promise<Workspace | null> => {
    if (USE_MOCK) return mockApi.getWorkspace(id);
    throw new Error("Not implemented");
  },

  getAgents: async (workspaceId: string): Promise<Agent[]> => {
    if (USE_MOCK) return mockApi.getAgents(workspaceId);
    throw new Error("Not implemented");
  },

  getCrews: async (workspaceId: string): Promise<Crew[]> => {
    if (USE_MOCK) return mockApi.getCrews(workspaceId);
    throw new Error("Not implemented");
  },

  getPatterns: async (workspaceId: string): Promise<Pattern[]> => {
    if (USE_MOCK) return mockApi.getPatterns(workspaceId);
    throw new Error("Not implemented");
  },

  getTemplates: async (workspaceId: string): Promise<Template[]> => {
    if (USE_MOCK) return mockApi.getTemplates(workspaceId);
    throw new Error("Not implemented");
  },

  getServices: async (workspaceId: string): Promise<Service[]> => {
    if (USE_MOCK) return mockApi.getServices(workspaceId);
    throw new Error("Not implemented");
  },

  getAutomations: async (workspaceId: string): Promise<Automation[]> => {
    if (USE_MOCK) return mockApi.getAutomations(workspaceId);
    throw new Error("Not implemented");
  }
};
