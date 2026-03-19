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

export const useCreatePattern = (workspaceId: string): UseMutationResult<Pattern, Error, any> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-pattern', workspaceId],
        mutationFn: async (pattern: any): Promise<Pattern> => await workspacesApi.createPattern(workspaceId, pattern),
        onMutate: async (newPattern) => {
            await queryClient.cancelQueries({ queryKey: ["patterns", workspaceId] });
            const previousPatterns = queryClient.getQueryData<Pattern[]>(["patterns", workspaceId]);
            
            queryClient.setQueryData(["patterns", workspaceId], (old: Pattern[] = []) => [
                ...old,
                { ...newPattern, id: 'temp-' + Date.now() } as Pattern
            ]);
            
            return { previousPatterns };
        },
        onError: (err, newPattern, context) => {
            queryClient.setQueryData(["patterns", workspaceId], context?.previousPatterns);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["patterns", workspaceId] });
        },
    });
};

export const useDeletePattern = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (patternId: string): Promise<void> => await workspacesApi.deletePattern(workspaceId, patternId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["patterns", workspaceId] });
        },
    });
};
