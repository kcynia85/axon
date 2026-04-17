// frontend/src/modules/spaces/application/useSpacePageManagementLogic.ts

"use client";

import { useParams } from "next/navigation";
import { useSpaceQuery } from "./hooks";

type SpacePageManagementLogic = {
    readonly spaceIdentifier: string;
    readonly isPageLoading: boolean;
    readonly pageErrorInformation: Error | null;
    readonly initialCanvasInformation: any;
};

export const useSpacePageManagementLogic = (): SpacePageManagementLogic => {
  const routeParameters = useParams();
  const spaceIdentifier = routeParameters.id as string;
  
  const { data: spaceData, isLoading, error } = useSpaceQuery(spaceIdentifier);

  return {
    spaceIdentifier,
    isPageLoading: isLoading,
    pageErrorInformation: error as Error,
    initialCanvasInformation: spaceData,
  };
};
