import { InboxItem } from "../../../domain";
import { isMockMode } from "@/shared/infrastructure/mock-adapter";
import { getInboxItemsMock } from "./mock-api";
import { createClient } from "@/shared/infrastructure/supabase/server";
import { API_BASE_URL } from "@/shared/lib/api-client/config";

export const getInboxItems = async (): Promise<InboxItem[]> => {
    if (isMockMode()) {
        return getInboxItemsMock();
    }
    
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    try {
        const res = await fetch(`${API_BASE_URL}/artifacts/inbox`, {
            cache: "no-store",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch inbox items", res.status, await res.text());
            return [];
        }

        return res.json();
    } catch (error) {
        console.error("Error fetching inbox items:", error);
        return [];
    }
};