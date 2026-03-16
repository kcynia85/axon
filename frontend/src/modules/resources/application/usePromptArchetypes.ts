import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";
import { PromptArchetype } from "@/shared/domain/resources";

/**
 * usePromptArchetypes: Hook for fetching all available prompt archetypes.
 */
export const usePromptArchetypes = (): UseQueryResult<PromptArchetype[]> => {
    return useQuery({
        queryKey: ["prompt-archetypes"],
        queryFn: async (): Promise<PromptArchetype[]> => await resourcesApi.getPromptArchetypes(),
    });
};

/**
 * usePromptArchetype: Hook for fetching a single prompt archetype by ID.
 */
export const usePromptArchetype = (id: string): UseQueryResult<PromptArchetype> => {
    return useQuery({
        queryKey: ["prompt-archetype", id],
        queryFn: async (): Promise<PromptArchetype> => await resourcesApi.getPromptArchetype(id),
        enabled: !!id,
    });
};

/**
 * useCreatePromptArchetype: Hook for creating a new prompt archetype.
 */
export const useCreatePromptArchetype = (): UseMutationResult<PromptArchetype, Error, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (archetype: unknown): Promise<PromptArchetype> => await resourcesApi.createPromptArchetype(archetype),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
};

/**
 * useUpdatePromptArchetype: Hook for updating an existing prompt archetype.
 */
export const useUpdatePromptArchetype = (): UseMutationResult<PromptArchetype, Error, { id: string; archetype: unknown }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, archetype }: { id: string; archetype: unknown }): Promise<PromptArchetype> =>
            await resourcesApi.updatePromptArchetype(id, archetype),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
            queryClient.invalidateQueries({ queryKey: ["prompt-archetype"] });
        },
    });
};

/**
 * useDeletePromptArchetype: Hook for deleting a prompt archetype.
 */
export const useDeletePromptArchetype = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => await resourcesApi.deletePromptArchetype(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
};
