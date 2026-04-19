import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceCanvasInfrastructureApi } from "../../infrastructure/api";
import { SpaceCanvas } from "@/shared/domain/spaces";

export const useSpaceCanvasPersistence = (spaceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (canvasData: Partial<SpaceCanvas>) => 
            SpaceCanvasInfrastructureApi.persistCanvasConfiguration(spaceId, canvasData),
        onSuccess: () => {
            // Invalidate space data
            queryClient.invalidateQueries({ queryKey: ['space-canvas', spaceId] });
            queryClient.invalidateQueries({ queryKey: ['spaces', spaceId] });
            
            // CRITICAL: Invalidate all project artifacts because they are aggregated from space canvas data
            // We use a broad match on the 'artifacts' subkey of projects
            queryClient.invalidateQueries({ 
                queryKey: ['projects', 'artifacts'],
                exact: false 
            });
        }
    });
};
