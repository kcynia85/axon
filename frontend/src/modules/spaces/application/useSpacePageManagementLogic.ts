// frontend/src/modules/spaces/application/useSpacePageManagementLogic.ts

"use client";

import { useParams } from "next/navigation";

type SpacePageManagementLogic = {
    readonly spaceIdentifier: string;
    readonly isPageLoading: boolean;
    readonly pageErrorInformation: Error | null;
    readonly initialCanvasInformation: { readonly id: string };
};

export const useSpacePageManagementLogic = (): SpacePageManagementLogic => {
  const routeParameters = useParams();
  const spaceIdentifier = routeParameters.id as string;
  
  // Mocking data loading state for the current implementation phase
  const isPageLoading = false;
  const pageErrorInformation = null;
  const initialCanvasInformation = { id: spaceIdentifier };

  return {
    spaceIdentifier,
    isPageLoading,
    pageErrorInformation,
    initialCanvasInformation,
  };
};
