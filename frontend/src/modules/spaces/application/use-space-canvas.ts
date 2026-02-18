import { useQuery } from "@tanstack/react-query";
import { spacesApi } from "../infrastructure/api";

export const spaceKeys = {
  all: ["spaces"] as const,
  canvas: (id: string) => [...spaceKeys.all, "canvas", id] as const,
};

export const useSpaceCanvas = (spaceId: string) => {
  return useQuery({
    queryKey: spaceKeys.canvas(spaceId),
    queryFn: () => spacesApi.getSpaceCanvas(spaceId),
    enabled: !!spaceId,
  });
};
