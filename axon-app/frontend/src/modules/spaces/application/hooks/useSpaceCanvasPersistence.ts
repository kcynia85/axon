import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SpaceCanvasInfrastructureApi } from "../../infrastructure/api";
import { SpaceCanvas } from "@/shared/domain/spaces";

export const useSpaceCanvasPersistence = (spaceId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (canvasData: Partial<SpaceCanvas>) => 
            SpaceCanvasInfrastructureApi.persistCanvasConfiguration(spaceId, canvasData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['space-canvas', spaceId] });
        }
    });
};
