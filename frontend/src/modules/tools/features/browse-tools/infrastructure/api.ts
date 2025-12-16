import { Tool } from "../../../domain";
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

export const getTools = async (): Promise<Tool[]> => {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/agents/tools`, {
        headers,
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch tools");
    }

    return await res.json();
};
