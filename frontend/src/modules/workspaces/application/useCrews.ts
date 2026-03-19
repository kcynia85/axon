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

export const useCrew = (workspaceId: string, crewId: string): UseQueryResult<Crew> => {
    return useQuery({
        queryKey: ["crew", workspaceId, crewId],
        queryFn: async (): Promise<Crew> => await workspacesApi.getCrew(workspaceId, crewId),
        enabled: !!workspaceId && !!crewId,
    });
};

export const useCreateCrew = (workspaceId: string): UseMutationResult<Crew, Error, any> => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['create-crew', workspaceId],
        mutationFn: async (crew: any): Promise<Crew> => await workspacesApi.createCrew(workspaceId, crew),
        onMutate: async (newCrew) => {
            await queryClient.cancelQueries({ queryKey: ["crews", workspaceId] });
            const previousCrews = queryClient.getQueryData<Crew[]>(["crews", workspaceId]);
            
            queryClient.setQueryData(["crews", workspaceId], (old: Crew[] = []) => [
                ...old,
                { ...newCrew, id: 'temp-' + Date.now() } as Crew
            ]);
            
            return { previousCrews };
        },
        onError: (err, newCrew, context) => {
            queryClient.setQueryData(["crews", workspaceId], context?.previousCrews);
        },
        onSettled: () => {
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
