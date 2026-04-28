import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../infrastructure/api";
import { AutomationProvider } from "@/shared/domain/settings";

export const useAutomationProviders = () => {
    return useQuery({
        queryKey: ["automation-providers"],
        queryFn: () => settingsApi.getAutomationProviders(),
    });
};

export const useAutomationProvider = (id: string) => {
    return useQuery({
        queryKey: ["automation-providers", id],
        queryFn: () => settingsApi.getAutomationProvider(id),
        enabled: !!id,
    });
};

export const useCreateAutomationProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (provider: Omit<AutomationProvider, "id" | "created_at" | "updated_at">) => settingsApi.createAutomationProvider(provider),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automation-providers"] });
        },
    });
};

export const useUpdateAutomationProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string, data: Partial<AutomationProvider> }) => settingsApi.updateAutomationProvider(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automation-providers"] });
        },
    });
};

export const useDeleteAutomationProvider = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => settingsApi.deleteAutomationProvider(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automation-providers"] });
            queryClient.invalidateQueries({ queryKey: ["trash"] });
        },
    });
};

export const useTestAutomationConnection = () => {
    return useMutation({
        mutationFn: (request: any) => settingsApi.testAutomationConnection(request),
    });
};

