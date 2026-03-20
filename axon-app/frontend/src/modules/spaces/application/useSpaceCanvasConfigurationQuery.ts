// frontend/src/modules/spaces/application/useSpaceCanvasConfigurationQuery.ts

import { useQuery } from "@tanstack/react-query";
import { SpaceCanvasInfrastructureApi } from "../infrastructure/api";

export const SPACE_CANVAS_QUERY_KEYS = {
  base: ["spaces"] as const,
  configuration: (spaceIdentifier: string) => [...SPACE_CANVAS_QUERY_KEYS.base, "canvas", spaceIdentifier] as const,
};

export const useSpaceCanvasConfigurationQuery = (spaceIdentifier: string) => {
  return useQuery({
    queryKey: SPACE_CANVAS_QUERY_KEYS.configuration(spaceIdentifier),
    queryFn: () => SpaceCanvasInfrastructureApi.fetchSpaceCanvasConfiguration(spaceIdentifier),
    enabled: !!spaceIdentifier,
  });
};
