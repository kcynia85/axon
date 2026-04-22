import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inboxApi } from "../infrastructure/api";
import { useSystemAwareness } from "@/shared/lib/hooks/useSystemAwareness";

export const useInboxItems = () => {
    const { lastSyncTime } = useSystemAwareness();
    
    return useQuery({
        // Adding lastSyncTime to queryKey ensures automatic refetch 
        // when WebSocket awareness_synchronized event arrives.
        // Standard: Zero useEffect pattern.
        queryKey: ["inbox-items", lastSyncTime?.getTime() || "initial"],
        queryFn: () => inboxApi.getInboxItems(),
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
    });
}

export const useResolveInboxItem = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => inboxApi.resolveItem(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
        },
    });
}

export const useBulkResolveInboxItems = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (ids: string[]) => inboxApi.bulkResolve(ids),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inbox-items"] });
        },
    });
}
