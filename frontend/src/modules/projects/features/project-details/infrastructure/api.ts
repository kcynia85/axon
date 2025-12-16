import { Project, Artifact } from "../../../domain";
import { API_BASE_URL, endpoints } from "@/shared/lib/api-client/config";
import { createClient } from "@/shared/infrastructure/supabase/client";

export const getProjectDetails = async (id: string): Promise<Project | null> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "test-token";

    try {
        const res = await fetch(`${API_BASE_URL}${endpoints.projects.detail(id)}`, {
            cache: "no-store",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (res.status === 404) return null;
        if (!res.ok) throw new Error("Failed to fetch project");

        return res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
};

export const getProjectArtifacts = async (projectId: string): Promise<Artifact[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "test-token";

    try {
        const res = await fetch(`${API_BASE_URL}/artifacts/project/${projectId}`, {
            cache: "no-store",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch artifacts");
            return [];
        }

        return res.json();
    } catch (e) {
        console.error(e);
        return [];
    }
};

export const deleteProject = async (id: string): Promise<void> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "test-token";

    const res = await fetch(`${API_BASE_URL}${endpoints.projects.detail(id)}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to delete project");
    }
};
