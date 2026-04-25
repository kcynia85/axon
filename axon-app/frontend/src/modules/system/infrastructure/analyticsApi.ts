import { authenticatedClient } from "@/shared/lib/api-client/authenticated-client";

export interface TokenUsageData {
    date: string;
    tokens: number;
}

export interface TokenSummary {
    total_tokens: number;
    total_cost_pln: number;
}

export const analyticsApi = {
    getTokenUsage: async (category?: string, modelName?: string, days: number = 7): Promise<TokenUsageData[]> => {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (modelName) params.append('model_name', modelName);
        params.append('days', days.toString());
        
        return await authenticatedClient.get<TokenUsageData[]>(`/analytics/token-usage?${params.toString()}`);
    },
    getAvailableModels: async (): Promise<string[]> => {
        return await authenticatedClient.get<string[]>('/analytics/models');
    },
    getTokenSummary: async (): Promise<TokenSummary> => {
        return await authenticatedClient.get<TokenSummary>('/analytics/summary');
    }
};
