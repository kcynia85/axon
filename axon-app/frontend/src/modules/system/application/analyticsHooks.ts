import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "../infrastructure/analyticsApi";

export const useTokenUsageQuery = (category?: string, modelName?: string, days: number = 7) => {
    return useQuery({
        queryKey: ['analytics', 'token-usage', category, modelName, days],
        queryFn: () => analyticsApi.getTokenUsage(category, modelName, days)
    });
};

export const useAvailableModelsQuery = () => {
    return useQuery({
        queryKey: ['analytics', 'models'],
        queryFn: () => analyticsApi.getAvailableModels()
    });
};

export const useTokenSummaryQuery = () => {
    return useQuery({
        queryKey: ['analytics', 'summary'],
        queryFn: () => analyticsApi.getTokenSummary()
    });
};
