import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Template } from "@/shared/domain/workspaces";

export function useTemplates(workspaceId: string) {
    return useQuery({
        queryKey: ["templates", workspaceId],
        queryFn: () => workspacesApi.getTemplates(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCreateTemplate(workspaceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (template: Omit<Template, "id" | "created_at" | "updated_at">) => workspacesApi.createTemplate(workspaceId, template),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
        },
    });
}
