import { Workflow } from "../../../domain";
import { API_BASE_URL } from "@/shared/lib/api-client/config";
import { createClient } from "@/shared/infrastructure/supabase/client";

const getAuthHeaders = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    const token = session?.access_token || "test-token";
    headers["Authorization"] = `Bearer ${token}`;
    
    return headers;
};

export const getWorkflows = async (projectId?: string): Promise<Workflow[]> => {
    const headers = await getAuthHeaders();
    let url = `${API_BASE_URL}/workflows`;
    // FIX: Add trailing slash if query params are not present to avoid 307 redirect
    // FastAPI might redirect /workflows to /workflows/
    if (!projectId) {
        url = `${API_BASE_URL}/workflows/`; 
    } else {
        url = `${API_BASE_URL}/workflows/?project_id=${projectId}`;
    }
    
    const res = await fetch(url, {
        headers,
        cache: "no-store"
    });
    
    if (!res.ok) {
        throw new Error("Failed to fetch workflows");
    }
    
    // Adapt backend model (snake_case) to frontend model (camelCase)
    const data = await res.json();
    return data.map((w: any) => ({
        id: w.id,
        title: w.title,
        description: w.description,
        status: w.status,
        stepsCount: w.steps_count,
        lastRun: w.last_run,
        projectId: w.project_id
    }));
};

export const createWorkflow = async (workflow: Omit<Workflow, 'id' | 'lastRun'> & { projectId: string }): Promise<Workflow> => {
    const headers = await getAuthHeaders();
    // Ensure trailing slash for POST
    const res = await fetch(`${API_BASE_URL}/workflows/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            project_id: workflow.projectId,
            title: workflow.title,
            description: workflow.description,
            status: workflow.status,
            steps_count: workflow.stepsCount
        })
    });

    if (!res.ok) {
        throw new Error("Failed to create workflow");
    }

    const w = await res.json();
    return {
        id: w.id,
        title: w.title,
        description: w.description,
        status: w.status,
        stepsCount: w.steps_count,
        lastRun: w.last_run,
        projectId: w.project_id
    } as Workflow;
};

export const deleteWorkflow = async (id: string): Promise<void> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/workflows/${id}`, {
        method: "DELETE",
        headers
    });

    if (!res.ok) {
        throw new Error("Failed to delete workflow");
    }
};