import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Automation } from "@/shared/domain/workspaces";

export const useAutomations = (workspaceId: string): UseQueryResult<Automation[]> => {
    return useQuery({
        queryKey: ["automations", workspaceId],
        queryFn: async (): Promise<Automation[]> => await workspacesApi.getAutomations(workspaceId),
        enabled: !!workspaceId,
    });
};
