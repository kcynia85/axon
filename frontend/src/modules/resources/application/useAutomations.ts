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
