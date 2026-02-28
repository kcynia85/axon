import { API_BASE_URL, endpoints } from "@/shared/lib/api-client/config";
import { Project, ProjectStatus } from "../../../domain";
import { createClient } from "@/shared/infrastructure/supabase/client";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const MOCK_PROJECTS: Project[] = [
    {
        id: "p1",
        project_name: "Phoenix Redesign",
        project_status: ProjectStatus.IN_PROGRESS,
        project_keywords: ["design", "ui", "ux"],
        project_summary: "Main redesign project for the core platform.",
        created_at: "2026-01-10T09:00:00Z",
        updated_at: "2026-02-24T12:00:00Z",
        owner_id: "u1"
    },
    {
        id: "p2",
        project_name: "SEO Optimization",
        project_status: ProjectStatus.IDEA,
        project_keywords: ["seo", "marketing"],
        project_summary: "Improving organic reach for the blog.",
        created_at: "2026-01-15T09:00:00Z",
        updated_at: "2026-02-22T10:00:00Z",
        owner_id: "u1"
    },
    {
        id: "p3",
        project_name: "API Integration",
        project_status: ProjectStatus.COMPLETED,
        project_keywords: ["backend", "api"],
        project_summary: "Integrating with 3rd party providers.",
        created_at: "2026-01-20T09:00:00Z",
        updated_at: "2026-02-23T14:00:00Z",
        owner_id: "u1"
    }
];

export const getProjects = async (): Promise<Project[]> => {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_PROJECTS), 500));
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
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
