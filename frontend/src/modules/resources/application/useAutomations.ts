import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Automation } from "@/shared/domain/resources";
import { resourcesApi } from "../infrastructure/api";

export const useAutomations = () => {
    return useQuery({
        queryKey: ["automations"],
        queryFn: async (): Promise<Automation[]> => {
            return resourcesApi.getAutomations();
        },
    });
};

export const useAutomation = (automationId: string) => {
    return useQuery({
        queryKey: ["automation", automationId],
        queryFn: async (): Promise<Automation> => {
            return resourcesApi.getAutomation(automationId);
        },
        enabled: !!automationId,
    });
};

export const useCreateAutomation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: unknown) => {
            return resourcesApi.createAutomation(data as unknown);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};

export const useUpdateAutomation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id: string; data: unknown }) => {
            return resourcesApi.updateAutomation(id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};

export const useDeleteAutomation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string) => {
            return resourcesApi.deleteAutomation(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};
