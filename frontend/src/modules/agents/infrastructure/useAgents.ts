import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { agentsApi } from "./api";
import { Agent } from "@/shared/domain/workspaces";

export const useAgents = (workspaceId: string): UseQueryResult<Agent[]> => {
    return useQuery({
        queryKey: ["agents", workspaceId],
        queryFn: async (): Promise<Agent[]> => await agentsApi.getAgents(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useAgent = (agentId: string): UseQueryResult<Agent> => {
    return useQuery({
        queryKey: ["agent", agentId],
        queryFn: async (): Promise<Agent> => await agentsApi.getAgent(agentId),
        enabled: !!agentId,
    });
};

export const useCreateAgent = (): UseMutationResult<Agent, Error, Partial<Agent>> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-agent'],
        mutationFn: async (agent: Partial<Agent>): Promise<Agent> => await agentsApi.createAgent(agent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};

export const useUpdateAgent = (): UseMutationResult<Agent, Error, { id: string; agent: Partial<Agent> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, agent }: { id: string; agent: Partial<Agent> }): Promise<Agent> =>
            await agentsApi.updateAgent(id, agent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};

export const useDeleteAgent = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => await agentsApi.deleteAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};

export const useInspectAgentDeletion = (agentId: string | null) => {
    return useQuery({
        queryKey: ["agent-inspect-deletion", agentId],
        queryFn: async () => agentId ? await agentsApi.inspectDeletion(agentId) : [],
        enabled: !!agentId,
    });
};
