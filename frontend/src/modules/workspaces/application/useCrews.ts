import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Crew } from "@/shared/domain/workspaces";

export const useCrews = (workspaceId: string): UseQueryResult<Crew[]> => {
    return useQuery({
        queryKey: ["crews", workspaceId],
        queryFn: async (): Promise<Crew[]> => await workspacesApi.getCrews(workspaceId),
        enabled: !!workspaceId,
    });
};

export const useCreateCrew = (workspaceId: string): UseMutationResult<Crew, Error, Omit<Crew, "id" | "created_at" | "updated_at">> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (crew: Omit<Crew, "id" | "created_at" | "updated_at">): Promise<Crew> => await workspacesApi.createCrew(workspaceId, crew),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
};

export const useUpdateCrew = (workspaceId: string): UseMutationResult<Crew, Error, { crewId: string; crew: Partial<Crew> }> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ crewId, crew }: { crewId: string; crew: Partial<Crew> }): Promise<Crew> =>
            await workspacesApi.updateCrew(workspaceId, crewId, crew),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
};

export const useDeleteCrew = (workspaceId: string): UseMutationResult<void, Error, string> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (crewId: string): Promise<void> => await workspacesApi.deleteCrew(workspaceId, crewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
};
