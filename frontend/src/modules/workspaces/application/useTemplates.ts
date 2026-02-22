import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Template } from "@/shared/domain/workspaces";

export const useTemplates = (workspaceId: string): UseQueryResult<Template[]> => {
    return useQuery({
        queryKey: ["templates", workspaceId],
        queryFn: async (): Promise<Template[]> => await workspacesApi.getTemplates(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreateTemplate = (workspaceId: string): UseMutationResult<Template, Error, Omit<Template, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (template: Omit<Template, "id" | "created_at" | "updated_at">): Promise<Template> => await workspacesApi.createTemplate(workspaceId, template),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
        },
    });
};
