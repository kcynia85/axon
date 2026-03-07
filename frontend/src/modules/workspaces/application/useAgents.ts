import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Agent } from "@/shared/domain/workspaces";

export const useAgents = (workspaceId: string): UseQueryResult<Agent[]> => {
    return useQuery({
        queryKey: ["agents", workspaceId],
        queryFn: async (): Promise<Agent[]> => await workspacesApi.getAgents(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreateAgent = (): UseMutationResult<Agent, Error, Partial<Agent>> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-agent'],
        mutationFn: async (agent: Partial<Agent>): Promise<Agent> => await workspacesApi.createAgent(agent),
        onSuccess: () => {
            // Invalidate both global and workspace-specific agent lists if needed
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};

export const useUpdateAgent = (): UseMutationResult<Agent, Error, { id: string; agent: Partial<Agent> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, agent }: { id: string; agent: Partial<Agent> }): Promise<Agent> =>
            await workspacesApi.updateAgent(id, agent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};

export const useDeleteAgent = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => await workspacesApi.deleteAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
};
