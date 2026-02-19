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
        mutationFn: async (data: any) => {
            return resourcesApi.createAutomation(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};
