import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";
import { Agent, AgentSchema } from "@/shared/domain/workspaces";
import { mockApi } from "@/modules/workspaces/infrastructure/mockApi";

// Set to false to use real backend
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const agentsApi = {
  getAgents: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Agent[]> => {
    if (USE_MOCK) return mockApi.getAgents(workspaceId, limit, offset);
    const data = await authenticatedClient.get<unknown[]>(`/agents/?workspace=${workspaceId}&limit=${limit}&offset=${offset}`);
    return data.map((agentRaw) => AgentSchema.parse(agentRaw));
  },

  getAgent: async (id: string): Promise<Agent> => {
    if (USE_MOCK) {
        // Find agent in mockApi workspaces if needed, or implement mockApi.getAgent
        const agent = await mockApi.getAgents("", 100, 0).then(agents => agents.find(a => a.id === id));
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
};
