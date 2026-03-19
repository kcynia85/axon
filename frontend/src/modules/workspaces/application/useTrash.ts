import { useQuery, UseQueryResult } from "@tanstack/react-query";
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
