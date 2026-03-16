import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Automation } from "@/shared/domain/workspaces";

/**
 * useAutomations: Fetches all automations for a given workspace.
 */
export const useAutomations = (workspaceId: string): UseQueryResult<Automation[]> => {
    return useQuery({
        queryKey: ["automations", workspaceId],
        queryFn: async (): Promise<Automation[]> => await workspacesApi.getAutomations(workspaceId),
        enabled: !!workspaceId,
    });
};

/**
 * useAutomation: Fetches a single automation by ID.
 */
export const useAutomation = (workspaceId: string, automationId: string): UseQueryResult<Automation> => {
    return useQuery({
        queryKey: ["automation", workspaceId, automationId],
        queryFn: async (): Promise<Automation> => await workspacesApi.getAutomation(workspaceId, automationId),
        enabled: !!workspaceId && !!automationId,
    });
};

/**
 * useCreateAutomation: Mutation hook to create a new automation.
 */
export const useCreateAutomation = (workspaceId: string): UseMutationResult<Automation, Error, Omit<Automation, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<Automation, "id" | "created_at" | "updated_at">): Promise<Automation> => {
            return await workspacesApi.createAutomation(workspaceId, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations", workspaceId] });
        },
    });
};

/**
 * useUpdateAutomation: Mutation hook to update an existing automation.
 */
export const useUpdateAutomation = (workspaceId: string): UseMutationResult<Automation, Error, { automationId: string; automation: Partial<Automation> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ automationId, automation }: { automationId: string; automation: Partial<Automation> }): Promise<Automation> => {
            return await workspacesApi.updateAutomation(workspaceId, automationId, automation);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations", workspaceId] });
            queryClient.invalidateQueries({ queryKey: ["automation", workspaceId] });
        },
    });
};

/**
 * useDeleteAutomation: Mutation hook to delete an automation.
 */
export const useDeleteAutomation = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (automationId: string): Promise<void> => {
            await workspacesApi.deleteAutomation(workspaceId, automationId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations", workspaceId] });
        },
    });
};
