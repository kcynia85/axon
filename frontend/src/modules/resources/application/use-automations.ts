import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client/config";
import { Automation } from "@/shared/domain/resources";

export const useAutomations = () => {
    return useQuery({
        queryKey: ["automations"],
        queryFn: async () => {
            const response = await apiClient.get("/resources/automations");
            return response.json() as Promise<Automation[]>;
        },
    });
};

export const useCreateAutomation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/resources/automations", data);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["automations"] });
        },
    });
};
