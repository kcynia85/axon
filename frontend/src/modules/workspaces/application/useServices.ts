import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { ExternalService as Service } from "@/shared/domain/resources";

/**
 * useServices: Hook for fetching all available service definitions (global).
 */
export const useServices = (_workspaceId?: string): UseQueryResult<Service[]> => {
    return useQuery({
        queryKey: ["external-services"],
        queryFn: async (): Promise<Service[]> => await resourcesApi.getExternalServices(),
    });
};

/**
 * useService: Hook for fetching a single service definition.
 */
export const useService = (_workspaceId: string, serviceId: string): UseQueryResult<Service> => {
    return useQuery({
        queryKey: ["external-service", serviceId],
        queryFn: async (): Promise<Service> => await resourcesApi.getExternalService(serviceId),
        enabled: !!serviceId,
    });
};

/**
 * useCreateService: Hook for creating a new service definition.
 */
export const useCreateService = (_workspaceId: string): UseMutationResult<Service, Error, Omit<Service, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (service: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> => await resourcesApi.createExternalService(service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};

/**
 * useUpdateService: Hook for updating an existing service definition.
 */
export const useUpdateService = (_workspaceId: string): UseMutationResult<Service, Error, { serviceId: string; service: Partial<Service> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ serviceId, service }: { serviceId: string; service: Partial<Service> }): Promise<Service> =>
            await resourcesApi.updateExternalService(serviceId, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
            queryClient.invalidateQueries({ queryKey: ["external-service"] });
        },
    });
};

/**
 * useDeleteService: Hook for deleting a service definition.
 */
export const useDeleteService = (_workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: string): Promise<void> => await resourcesApi.deleteExternalService(serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};
