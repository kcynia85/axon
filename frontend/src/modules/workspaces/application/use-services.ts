import { useQuery } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";

export function useServices(workspaceId: string) {
    return useQuery({
        queryKey: ["services", workspaceId],
        queryFn: () => workspacesApi.getServices(workspaceId),
        enabled: !!workspaceId,
    });
}
