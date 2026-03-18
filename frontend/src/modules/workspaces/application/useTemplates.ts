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

export const useTemplate = (workspaceId: string, templateId: string): UseQueryResult<Template> => {
    return useQuery({
        queryKey: ["template", workspaceId, templateId],
        queryFn: async (): Promise<Template> => await workspacesApi.getTemplate(workspaceId, templateId),
        enabled: !!workspaceId && !!templateId,
    });
};

export const useCreateTemplate = (workspaceId: string): UseMutationResult<Template, Error, Omit<Template, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (template: Omit<Template, "id" | "created_at" | "updated_at">): Promise<Template> => await workspacesApi.createTemplate(workspaceId, template),
        onSuccess: (newTemplate) => {
            queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
            // Invalidate the specific template query to refetch
            queryClient.invalidateQueries({ queryKey: ["template", workspaceId, newTemplate.id] });
        },
    });
};

export const useUpdateTemplate = (workspaceId: string): UseMutationResult<Template, Error, { templateId: string; template: Partial<Template> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ templateId, template }: { templateId: string; template: Partial<Template> }): Promise<Template> =>
            await workspacesApi.updateTemplate(workspaceId, templateId, template),
        onSuccess: (updatedTemplate) => {
            queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
            // Invalidate the specific template query to refetch
            queryClient.invalidateQueries({ queryKey: ["template", workspaceId, updatedTemplate.id] });
        },
    });
};

export const useDeleteTemplate = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (templateId: string): Promise<void> => await workspacesApi.deleteTemplate(workspaceId, templateId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates", workspaceId] });
        },
    });
};
