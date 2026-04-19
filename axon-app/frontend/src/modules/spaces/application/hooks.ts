'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { SpaceCanvasInfrastructureApi } from "../infrastructure/api";
import { CreateSpaceFormData } from "./schemas";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const spacesKeys = {
    all: ['spaces'] as const,
    lists: () => [...spacesKeys.all, 'list'] as const,
};

export const useSpaces = () => {
    return useQuery({
        queryKey: spacesKeys.lists(),
        queryFn: () => SpaceCanvasInfrastructureApi.getSpaces(),
    });
};

export const useSpaceQuery = (id: string) => {
    return useQuery({
        queryKey: ['spaces', id],
        queryFn: () => SpaceCanvasInfrastructureApi.getSpaceById(id),
        enabled: !!id,
    });
};

export const useUpdateSpaceMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, updates }: { id: string, updates: Partial<Space> }) => 
            SpaceCanvasInfrastructureApi.updateSpace(id, updates),
        onSuccess: (updatedSpace) => {
            queryClient.invalidateQueries({ queryKey: spacesKeys.lists() });
            queryClient.invalidateQueries({ queryKey: ['spaces', updatedSpace.id] });
            queryClient.invalidateQueries({ queryKey: ['space-canvas', updatedSpace.id] });
            
            // Invalidate project artifacts as they might be affected by space status/name changes
            queryClient.invalidateQueries({ 
                queryKey: ['projects', 'artifacts'],
                exact: false 
            });
            
            toast.success("Zmiany zostały zapisane");
        },
        onError: () => {
            toast.error("Nie udało się zapisać zmian");
        }
    });
};

export const usePersistCanvasMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ spaceId, config }: { spaceId: string, config: Partial<SpaceCanvas> }) => 
            SpaceCanvasInfrastructureApi.persistCanvasConfiguration(spaceId, config),
        onSuccess: (_, { spaceId }) => {
            queryClient.invalidateQueries({ queryKey: ['spaces', spaceId] });
            queryClient.invalidateQueries({ queryKey: ['space-canvas', spaceId] });
            
            // Invalidate project artifacts aggregated from canvas
            queryClient.invalidateQueries({ 
                queryKey: ['projects', 'artifacts'],
                exact: false 
            });
        }
    });
};

export const useCreateSpaceMutation = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: CreateSpaceFormData) => SpaceCanvasInfrastructureApi.createSpace(data),
        onSuccess: (newSpace) => {
            queryClient.invalidateQueries({ queryKey: spacesKeys.lists() });
            toast.success("Space został utworzony");
            router.push(`/spaces/${newSpace.id}`);
            router.refresh();
        },
        onError: () => {
            toast.error("Nie udało się utworzyć space'a");
        }
    });
};
