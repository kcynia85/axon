import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";

export function usePromptArchetypes() {
    return useQuery({
        queryKey: ["prompt-archetypes"],
        queryFn: () => resourcesApi.getPromptArchetypes(),
    });
}

export function useCreatePromptArchetype() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (archetype: any) => resourcesApi.createPromptArchetype(archetype),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["prompt-archetypes"] });
        },
    });
}
