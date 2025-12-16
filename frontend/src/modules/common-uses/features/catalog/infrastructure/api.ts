import { Scenario } from "../../../domain";
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

export const getScenarios = async (): Promise<Scenario[]> => {
    const headers = await getAuthHeaders();
    // Fetch Global Templates
    const res = await fetch(`${API_BASE_URL}/projects/templates`, {
        headers,
        cache: "no-store"
    });

    if (!res.ok) {
        throw new Error("Failed to fetch scenario templates");
    }

    const data = await res.json();
    return data.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        promptTemplate: s.prompt_template,
        icon: s.icon
    }));
};