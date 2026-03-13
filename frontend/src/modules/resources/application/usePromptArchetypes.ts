import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";

export const usePromptArchetypes = () => {
    return useQuery({
        queryKey: ["prompt-archetypes"],
        queryFn: () => resourcesApi.getPromptArchetypes(),
    });
}

export const usePromptArchetype = (id: string) => {
    return useQuery({
        queryKey: ["prompt-archetype", id],
        queryFn: () => resourcesApi.getPromptArchetype(id),
        enabled: !!id,
    });
}

export const useCreatePromptArchetype = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (archetype: unknown) => resourcesApi.createPromptArchetype(archetype as unknown),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
}

export const useUpdatePromptArchetype = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, archetype }: { id: string; archetype: unknown }) => resourcesApi.updatePromptArchetype(id, archetype),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
}

export const useDeletePromptArchetype = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => resourcesApi.deletePromptArchetype(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
}
