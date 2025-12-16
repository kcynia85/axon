import { AgentConfig } from "../domain";
import { API_BASE_URL } from "@/shared/lib/api-client/config";
import { createClient } from "@/shared/infrastructure/supabase/client";

const getAuthHeaders = async () => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const headers: Record<string, string> = {
        "Content-Type": "application/json"
    };
    if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
    }
    return headers;
};

export const getAgents = async (): Promise<AgentConfig[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/configs`, { headers });
    if (!res.ok) throw new Error("Failed to fetch agents");
    return res.json();
};

export const updateAgentConfig = async (config: AgentConfig): Promise<AgentConfig> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/configs/${config.role}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(config)
    });
    if (!res.ok) throw new Error("Failed to update agent config");
    return res.json();
}
