import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Service } from "@/shared/domain/workspaces";

export const useServices = (workspaceId: string): UseQueryResult<Service[]> => {
    return useQuery({
        queryKey: ["services", workspaceId],
        queryFn: async (): Promise<Service[]> => await workspacesApi.getServices(workspaceId),
        enabled: !!workspaceId,
    });
};
