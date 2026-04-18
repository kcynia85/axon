import { Project, Artifact } from "@/modules/projects/domain";
import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";

export const getProjects = async (): Promise<readonly Project[]> => {
    return await authenticatedClient.get<Project[]>("/projects/");
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
    // Map frontend Partial<Project> to ProjectCreateDTO
    const payload = {
        project_name: data.project_name || "New Project",
        project_status: data.project_status || "idea",
        project_summary: data.project_summary || "",
        project_keywords: data.project_keywords || [],
        project_strategy_url: data.project_strategy_url || ""
    };
    return await authenticatedClient.post<Project>("/projects/", payload);
};

export const getProjectDetails = async (id: string): Promise<Project | null> => {
    try {
        return await authenticatedClient.get<Project>(`/projects/${id}`);
    } catch (error) {
        console.error(`Failed to fetch project ${id}:`, error);
        return null;
    }
};

export const getProjectArtifacts = async (projectId: string): Promise<readonly Artifact[]> => {
    return await authenticatedClient.get<Artifact[]>(`/projects/${projectId}/artifacts`);
};

export const deleteProject = async (id: string): Promise<void> => {
    await authenticatedClient.delete(`/projects/${id}`);
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<Project> => {
    return await authenticatedClient.patch<Project>(`/projects/${id}`, data);
};
