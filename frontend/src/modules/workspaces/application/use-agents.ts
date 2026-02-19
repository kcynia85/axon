import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Agent } from "@/shared/domain/workspaces";

export function useAgents(workspaceId: string) {
    return useQuery({
        queryKey: ["agents", workspaceId],
        queryFn: () => workspacesApi.getAgents(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCreateAgent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (agent: Partial<Agent>) => workspacesApi.createAgent(agent),
        onSuccess: (_, variables) => {
            // Invalidate both global and workspace-specific agent lists if needed
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
}

export function useUpdateAgent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, agent }: { id: string; agent: Partial<Agent> }) =>
            workspacesApi.updateAgent(id, agent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
}

export function useDeleteAgent() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => workspacesApi.deleteAgent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["agents"] });
        },
    });
}
