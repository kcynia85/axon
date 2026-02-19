import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Pattern } from "@/shared/domain/workspaces";

export function usePatterns(workspaceId: string) {
    return useQuery({
        queryKey: ["patterns", workspaceId],
        queryFn: () => workspacesApi.getPatterns(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCreatePattern(workspaceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (pattern: Omit<Pattern, "id" | "created_at" | "updated_at">) => workspacesApi.createPattern(workspaceId, pattern),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patterns", workspaceId] });
        },
    });
}
