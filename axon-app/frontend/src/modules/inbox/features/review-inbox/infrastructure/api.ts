import { InboxItem } from "../../../domain";
import { createClient } from "@/shared/infrastructure/supabase/client";
import { API_BASE_URL } from "@/shared/lib/api-client/config";

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

const MOCK_INBOX: InboxItem[] = [
    {
        id: "i1",
        title: "PRD: Deep Research Analysis",
        type: "DOCUMENT",
        status: "REVIEW",
        projectName: "Deep Research Assistant",
        createdAt: "2026-02-28T10:00:00Z",
        preview: "This document contains the market research findings..."
    },
    {
        id: "i2",
        title: "Landing Page Copy",
        type: "DOCUMENT",
        status: "NEW",
        projectName: "SEO Content Writer",
        createdAt: "2026-02-28T11:00:00Z",
        preview: "New landing page copy for the upcoming launch."
    },
    {
        id: "i3",
        title: "Database Schema Draft",
        type: "CODE",
        status: "APPROVED",
        projectName: "API Integration",
        createdAt: "2026-02-27T15:00:00Z",
        preview: "SQL migrations for the new entities."
    }
];

export const getInboxItems = async (): Promise<InboxItem[]> => {
    if (USE_MOCK) {
        return new Promise(resolve => setTimeout(() => resolve(MOCK_INBOX), 500));
    }

    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || "test-token";

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