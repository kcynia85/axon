import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Pattern } from "@/shared/domain/workspaces";

export const usePatterns = (workspaceId: string): UseQueryResult<Pattern[]> => {
    return useQuery({
        queryKey: ["patterns", workspaceId],
        queryFn: async (): Promise<Pattern[]> => await workspacesApi.getPatterns(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreatePattern = (workspaceId: string): UseMutationResult<Pattern, Error, Omit<Pattern, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (pattern: Omit<Pattern, "id" | "created_at" | "updated_at">): Promise<Pattern> => await workspacesApi.createPattern(workspaceId, pattern),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patterns", workspaceId] });
        },
    });
};
