import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";

export function useAutomations(workspaceId: string) {
    return useQuery({
        queryKey: ["automations", workspaceId],
        queryFn: () => workspacesApi.getAutomations(workspaceId),
        enabled: !!workspaceId,
    });
}
