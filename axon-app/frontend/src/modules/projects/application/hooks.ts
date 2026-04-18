"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjects, createProject, deleteProject, getProjectArtifacts } from "../infrastructure/api";
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

export const useProjectArtifactsQuery = (projectId: string | null) => {
    return useQuery({
        queryKey: projectsKeys.artifacts(projectId || ""),
        queryFn: () => getProjectArtifacts(projectId!),
        enabled: !!projectId,
    });
};

export const useCreateProjectMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationKey: ['create-project'],
        mutationFn: async (values: CreateProjectFormData) => {
            return await createProject({
                project_name: values.name,
                project_status: ProjectStatus.IDEA,
                project_keywords: values.keywords,
                project_summary: null,
                project_strategy_url: values.links.find(l => l.url)?.url || null,
            });
        },
        onSuccess: (project) => {
            queryClient.invalidateQueries({ queryKey: projectsKeys.lists() });
            toast.success("Projekt został utworzony!");
            router.push(`/projects/${project.id}`);
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
