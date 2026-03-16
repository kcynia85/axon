import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { Automation } from "@/shared/domain/workspaces";
import { resourcesApi } from "../infrastructure/api";

/**
 * useAutomations: Hook for fetching all global automations.
 */
export const useAutomations = (): UseQueryResult<Automation[]> => {
    return useQuery({
        queryKey: ["automations"],
        queryFn: async (): Promise<Automation[]> => {
            return await resourcesApi.getAutomations();
        },
    });
};

/**
 * useAutomation: Hook for fetching a single global automation by ID.
 */
export const useAutomation = (automationId: string): UseQueryResult<Automation> => {
    return useQuery({
        queryKey: ["automation", automationId],
        queryFn: async (): Promise<Automation> => {
            return await resourcesApi.getAutomation(automationId);
        },
        enabled: !!automationId,
    });
};

/**
 * useCreateAutomation: Mutation hook to create a new global automation.
 */
export const useCreateAutomation = (): UseMutationResult<Automation, Error, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: unknown): Promise<Automation> => {
            return await resourcesApi.createAutomation(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};

/**
 * useUpdateAutomation: Mutation hook to update an existing global automation.
 */
export const useUpdateAutomation = (): UseMutationResult<Automation, Error, { id: string; data: unknown }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: unknown }): Promise<Automation> => {
            return await resourcesApi.updateAutomation(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
            queryClient.invalidateQueries({ queryKey: ["automation"] });
        },
    });
};

/**
 * useDeleteAutomation: Mutation hook to delete a global automation.
 */
export const useDeleteAutomation = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => {
            await resourcesApi.deleteAutomation(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};
