import { API_BASE_URL, endpoints } from "@/shared/lib/api-client/config";
import { Project } from "../../../domain";
import { createClient } from "@/shared/infrastructure/supabase/client";

export const getProjects = async (): Promise<Project[]> => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    // TEST OVERRIDE: Allow test-token if no session
    const token = session?.access_token || "test-token";

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
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    // TEST OVERRIDE: Allow test-token if no session
    const token = session?.access_token || "test-token";

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
