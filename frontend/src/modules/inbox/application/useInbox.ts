import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inboxApi } from "../infrastructure/api";

export function useInboxItems() {
    return useQuery({
        queryKey: ["inbox-items"],
        queryFn: () => inboxApi.getInboxItems(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

export function useResolveInboxItem() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inboxApi.resolveItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
        },
    });
}

export function useBulkResolveInboxItems() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => inboxApi.bulkResolve(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
        },
    });
}
