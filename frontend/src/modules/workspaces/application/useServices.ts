import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Service } from "@/shared/domain/workspaces";

export const useServices = (workspaceId: string): UseQueryResult<Service[]> => {
    return useQuery({
        queryKey: ["services", workspaceId],
        queryFn: async (): Promise<Service[]> => await workspacesApi.getServices(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useService = (workspaceId: string, serviceId: string): UseQueryResult<Service> => {
    return useQuery({
        queryKey: ["service", workspaceId, serviceId],
        queryFn: async (): Promise<Service> => await workspacesApi.getService(workspaceId, serviceId),
        enabled: !!workspaceId && !!serviceId,
    });
};

export const useCreateService = (workspaceId: string): UseMutationResult<Service, Error, Omit<Service, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (service: Omit<Service, "id" | "created_at" | "updated_at">): Promise<Service> => await workspacesApi.createService(workspaceId, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services", workspaceId] });
        },
    });
};

export const useUpdateService = (workspaceId: string): UseMutationResult<Service, Error, { serviceId: string; service: Partial<Service> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ serviceId, service }: { serviceId: string; service: Partial<Service> }): Promise<Service> =>
            await workspacesApi.updateService(workspaceId, serviceId, service),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services", workspaceId] });
        },
    });
};

export const useDeleteService = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (serviceId: string): Promise<void> => await workspacesApi.deleteService(workspaceId, serviceId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["services", workspaceId] });
        },
    });
};
