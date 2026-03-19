import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { TrashItem } from "@/shared/domain/workspaces";

/**
 * useTrash: Fetches all deleted items.
 */
export const useTrash = (): UseQueryResult<TrashItem[]> => {
    return useQuery({
        queryKey: ["trash"],
        queryFn: async (): Promise<TrashItem[]> => await workspacesApi.getTrash(),
    });
};

/**
 * useRestoreItem: Restores a deleted item.
 */
export const useRestoreItem = (): UseMutationResult<void, Error, { id: string; type: string }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, type }: { id: string; type: string }): Promise<void> => {
            await workspacesApi.restoreItem(id, type);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash"] });
            // Ideally invalidate specific lists too, but global invalidation might be too aggressive?
            // For simplicity, let's stick to trash first. The user will navigate away anyway.
            // But we should probably invalidate the lists where the item belongs.
            // Since we don't know the exact query keys for every list without complex logic, we can invalidate broad keys.
            queryClient.invalidateQueries({ queryKey: ["patterns"] });
            queryClient.invalidateQueries({ queryKey: ["templates"] });
            queryClient.invalidateQueries({ queryKey: ["crews"] });
            queryClient.invalidateQueries({ queryKey: ["automations"] });
            queryClient.invalidateQueries({ queryKey: ["agents"] });
            queryClient.invalidateQueries({ queryKey: ["services"] });
        },
    });
};

/**
 * usePurgeItem: Permanently deletes an item.
 */
export const usePurgeItem = (): UseMutationResult<void, Error, { id: string; type: string }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, type }: { id: string; type: string }): Promise<void> => {
            await workspacesApi.purgeItem(id, type);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
};
