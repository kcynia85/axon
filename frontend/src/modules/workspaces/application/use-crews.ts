import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { workspacesApi } from "../infrastructure/api";
import { Crew } from "@/shared/domain/workspaces";

export function useCrews(workspaceId: string) {
    return useQuery({
        queryKey: ["crews", workspaceId],
        queryFn: () => workspacesApi.getCrews(workspaceId),
        enabled: !!workspaceId,
    });
}

export function useCreateCrew(workspaceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (crew: Omit<Crew, "id" | "created_at" | "updated_at">) => workspacesApi.createCrew(workspaceId, crew),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
}

export function useUpdateCrew(workspaceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ crewId, crew }: { crewId: string; crew: Partial<Crew> }) =>
            workspacesApi.updateCrew(workspaceId, crewId, crew),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
}

export function useDeleteCrew(workspaceId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (crewId: string) => workspacesApi.deleteCrew(workspaceId, crewId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["crews", workspaceId] });
        },
    });
}
