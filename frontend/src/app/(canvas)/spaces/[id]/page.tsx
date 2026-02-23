// frontend/src/app/(canvas)/spaces/[id]/page.tsx

"use client";

import { SpaceCanvasView } from "@/modules/spaces/ui/View";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { ReactFlowProvider } from '@xyflow/react';
import { useSpacePageManagementLogic } from "@/modules/spaces/application/useSpacePageManagementLogic";
import React from "react";

const SpaceCanvasPage = () => {
  const { 
    isPageLoading, 
    pageErrorInformation, 
    initialCanvasInformation 
  } = useSpacePageManagementLogic();

  if (isPageLoading) {
    return (
      <PageContainer className="h-screen flex flex-col">
        <Skeleton className="flex-1 w-full" />
      </PageContainer>
    );
  }

  if (pageErrorInformation || !initialCanvasInformation) {
    return (
      <PageContainer>
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <p className="text-red-500">Error loading space: {pageErrorInformation?.message || "Not found"}</p>
        </div>
      </PageContainer>
    );
  }

  return (
      <main className="h-screen w-screen overflow-hidden bg-[#f9f9f9] dark:bg-[#0a0a0a]">
        <ReactFlowProvider>
          <SpaceCanvasView initialCanvasConfiguration={initialCanvasInformation} />
        </ReactFlowProvider>
      </main>
  );
};

export default SpaceCanvasPage;
