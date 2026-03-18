import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "@/modules/workspaces/infrastructure/api";
import { ExternalService as Service } from "@/shared/domain/resources";

/**
 * useServices: Hook for fetching all available service definitions (global).
 */
export const useServices = (workspaceId: string): UseQueryResult<Service[]> => {
    return useQuery({
        queryKey: ["external-services", workspaceId],
        queryFn: async (): Promise<Service[]> => await workspacesApi.getExternalServices(workspaceId),
    });
};

/**
 * useService: Hook for fetching a single service definition.
 */
export const useService = (workspaceId: string, serviceId: string): UseQueryResult<Service> => {
    return useQuery({
        queryKey: ["external-service", serviceId],
        queryFn: async (): Promise<Service> => await workspacesApi.getExternalService(workspaceId, serviceId),
        enabled: !!serviceId,
    });
};

/**
 * useCreateService: Hook for creating a new service definition.
 */
export const useCreateService = (workspaceId: string): UseMutationResult<Service, Error, Omit<Service, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (service: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> => await workspacesApi.createExternalService(workspaceId, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["workspaces", "detail", workspaceId, "services"] });
            queryClient.invalidateQueries({ queryKey: ["external-services", workspaceId] });
        },
    });
};

/**
 * useUpdateService: Hook for updating an existing service definition.
 */
export const useUpdateService = (workspaceId: string): UseMutationResult<Service, Error, { serviceId: string; service: Partial<Service> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ serviceId, service }: { serviceId: string; service: Partial<Service> }): Promise<Service> =>
            await workspacesApi.updateExternalService(workspaceId, serviceId, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services", workspaceId] });
            queryClient.invalidateQueries({ queryKey: ["external-service"] });
        },
    });
};

/**
 * useDeleteService: Hook for deleting a service definition.
 */
export const useDeleteService = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: string): Promise<void> => await workspacesApi.deleteExternalService(workspaceId, serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services", workspaceId] });
        },
    });
};
