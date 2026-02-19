import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ExternalService } from "@/shared/domain/resources";
import { resourcesApi } from "../infrastructure/api";

export const useExternalServices = () => {
    return useQuery({
        queryKey: ["external-services"],
        queryFn: async (): Promise<ExternalService[]> => {
            return resourcesApi.getExternalServices();
        },
    });
};

export const useCreateExternalService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: any) => {
            return resourcesApi.createExternalService(data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};
