import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/shared/lib/api-client/config";
import { ExternalService } from "@/shared/domain/resources";

export const useExternalServices = () => {
    return useQuery({
        queryKey: ["external-services"],
        queryFn: async () => {
            const response = await apiClient.get("/resources/services/external");
            return response.json() as Promise<ExternalService[]>;
        },
    });
};

export const useCreateExternalService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            const response = await apiClient.post("/resources/services/external", data);
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};
