import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";
import { ExternalService } from "@/shared/domain/resources";

/**
 * useExternalServices: Hook for fetching all available external service definitions.
 */
export const useExternalServices = (): UseQueryResult<ExternalService[]> => {
    return useQuery({
        queryKey: ["external-services"],
        queryFn: async (): Promise<ExternalService[]> => await resourcesApi.getExternalServices(),
    });
};

/**
 * useExternalService: Hook for fetching a single external service definition by ID.
 */
export const useExternalService = (id: string): UseQueryResult<ExternalService> => {
    return useQuery({
        queryKey: ["external-service", id],
        queryFn: async (): Promise<ExternalService> => await resourcesApi.getExternalService(id),
        enabled: !!id,
    });
};

/**
 * useCreateExternalService: Hook for creating a new external service definition.
 */
export const useCreateExternalService = (): UseMutationResult<ExternalService, Error, unknown> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (service: unknown): Promise<ExternalService> => await resourcesApi.createExternalService(service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};

/**
 * useUpdateExternalService: Hook for updating an existing external service definition.
 */
export const useUpdateExternalService = (): UseMutationResult<ExternalService, Error, { id: string; service: unknown }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, service }: { id: string; service: unknown }): Promise<ExternalService> =>
            await resourcesApi.updateExternalService(id, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
            queryClient.invalidateQueries({ queryKey: ["external-service"] });
        },
    });
};

/**
 * useDeleteExternalService: Hook for deleting an external service definition.
 */
export const useDeleteExternalService = (): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: string): Promise<void> => await resourcesApi.deleteExternalService(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-services"] });
        },
    });
};
