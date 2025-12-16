import { API_BASE_URL, endpoints } from "@/lib/api-client/config";
import { Project } from "../../../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getProjectsMock, createProjectMock } from "./mock-api";
import { createClient } from "@/shared/infrastructure/supabase/server";

export const getProjects = async (): Promise<Project[]> => {
    if (isMockMode()) {
        return getProjectsMock();
    }

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
        const res = await fetch(`${API_BASE_URL}${endpoints.projects.list}`, {
            cache: "no-store",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch projects", res.status, await res.text());
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const createProject = async (data: Partial<Project>): Promise<Project> => {
    if (isMockMode()) {
        return createProjectMock(data);
    }

    // Note: createProject might be called from Server Action or Client?
    // If Client, we can't use 'createClient' from server.ts.
    // For now, assuming Server Action or Server Component context.
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const res = await fetch(`${API_BASE_URL}${endpoints.projects.list}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to create project");
    }

    return res.json();
};
