import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";
import { Agent, AgentSchema } from "@/shared/domain/workspaces";

export const agentsApi = {
  getAgents: async (workspaceId: string, limit: number = 100, offset: number = 0): Promise<Agent[]> => {
    const data = await authenticatedClient.get<unknown[]>(`/agents/?workspace=${workspaceId}&limit=${limit}&offset=${offset}`);
    return data.map((agentRaw) => AgentSchema.parse(agentRaw));
  },

  getAgent: async (id: string): Promise<Agent> => {
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

  inspectDeletion: async (id: string): Promise<Array<{ id: string; name: string; role: string }>> => {
    return await authenticatedClient.get<Array<{ id: string; name: string; role: string }>>(`/agents/${id}/inspect-deletion`);
  },
};
