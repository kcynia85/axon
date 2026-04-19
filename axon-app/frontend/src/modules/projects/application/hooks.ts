"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, deleteProject, getProjectArtifacts, getProjectDetails } from "../infrastructure/api";
import { CreateProjectFormData } from "./schemas";
import { ProjectStatus } from "@/modules/projects/domain";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const projectsKeys = {
    all: ['projects'] as const,
    lists: () => [...projectsKeys.all, 'list'] as const,
    details: (id: string) => [...projectsKeys.all, 'detail', id] as const,
    artifacts: (id: string) => [...projectsKeys.all, 'artifacts', id] as const,
};

export const useProjectsQuery = () => {
    return useQuery({
        queryKey: projectsKeys.lists(),
        queryFn: getProjects,
    });
};

export const useProjectDetailsQuery = (id: string) => {
    return useQuery({
        queryKey: projectsKeys.details(id),
        queryFn: () => getProjectDetails(id),
        enabled: !!id,
    });
};

export const useProjectArtifactsQuery = (projectId: string | null) => {
    return useQuery({
        queryKey: projectsKeys.artifacts(projectId || ""),
        queryFn: () => getProjectArtifacts(projectId!),
        enabled: !!projectId,
        staleTime: 0, 
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchInterval: 3000, // Poll every 3 seconds for live sync between Canvas and Studio
    });
};

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationKey: ['create-project'],
        mutationFn: async ({ data, workspaceId }: { data: CreateProjectFormData, workspaceId?: string }) => {
            const allLinks = (data.links || []).map(l => l.url).filter(url => !!url);
            return await createProject({
                project_name: data.name,
                project_status: data.status as any,
                project_keywords: data.keywords,
                project_summary: data.description || null,
                project_strategy_url: allLinks[0] || null,
                key_resources: allLinks.slice(1),
                space_ids: (data.spaceIds && data.spaceIds.length > 0) ? data.spaceIds : [],
            } as any);
        },

        onSuccess: (project, variables) => {
            queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
            if (variables.workspaceId) {
                queryClient.setQueryData(['project-draft', variables.workspaceId], null);
                localStorage.removeItem(`axon_project_draft_${variables.workspaceId}`);
            }
            toast.success("Projekt został utworzony!");
            router.refresh();
        },
        onError: () => {
            toast.error("Nie udało się utworzyć projektu");
        }
    });
};

export const useDeleteProjectMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: deleteProject,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
            toast.success("Projekt został usunięty");
            router.refresh();
        },
        onError: () => {
            toast.error("Nie udało się usunąć projektu");
        }
    });
};

export const useUpdateProjectMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, data, workspaceId }: { id: string, data: CreateProjectFormData, workspaceId?: string }) => {
            const { updateProject } = await import("../infrastructure/api");
            const allLinks = (data.links || []).map(l => l.url).filter(url => !!url);
            return await updateProject(id, {
                project_name: data.name,
                project_status: data.status as any,
                project_keywords: data.keywords,
                project_summary: data.description || null,
                project_strategy_url: allLinks[0] || null,
                key_resources: allLinks.slice(1),
                space_ids: data.spaceIds || [],
            } as any);
        },

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: projectsKeys.details(variables.id) });
            if (variables.workspaceId) {
                queryClient.setQueryData(['project-draft', variables.workspaceId], null);
                localStorage.removeItem(`axon_project_draft_${variables.workspaceId}`);
            }
            toast.success("Projekt został zaktualizowany!");
        },
        onError: () => {
            toast.error("Nie udało się zaktualizować projektu");
        }
    });
};
