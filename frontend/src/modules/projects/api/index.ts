import { API_BASE_URL, endpoints } from "@/lib/api-client/config";
import { Project } from "../types";

export const getProjects = async (): Promise<Project[]> => {
    try {
        const res = await fetch(`${API_BASE_URL}${endpoints.projects.list}`, {
            cache: "no-store",
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
    const res = await fetch(`${API_BASE_URL}${endpoints.projects.list}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error("Failed to create project");
    }

    return res.json();
};
