import { apiClient } from "@/shared/lib/api-client/config";

export type KnowledgeSearchResult = {
    id: string;
    score: number;
    metadata: {
        text: string;
        hub_id?: string;
        [key: string]: any;
    };
};

export const knowledgeApi = {
    search: async (query: string, limit: number = 5): Promise<KnowledgeSearchResult[]> => {
        const params = new URLSearchParams({ query, limit: limit.toString() });
        const res = await apiClient.get(`/knowledge/search?${params.toString()}`);
        return await res.json() as KnowledgeSearchResult[];
    }
};
