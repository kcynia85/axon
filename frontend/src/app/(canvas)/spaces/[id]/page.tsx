"use client";

import { CanvasView } from "@/modules/spaces/ui/View";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { ReactFlowProvider } from '@xyflow/react';
import { useSpacePageLogic } from "@/modules/spaces/application/useSpacePageLogic";
import React from "react";

const SpaceCanvasPage = () => {
  const { isLoading, error, canvas } = useSpacePageLogic();

  if (isLoading) {
    return (
      <PageContainer className="h-screen flex flex-col">
        <Skeleton className="flex-1 w-full" />
      </PageContainer>
    );
  }

  if (error || !canvas) {
    return (
      <PageContainer>
        <div className="p-8 text-center border-2 border-dashed rounded-lg">
          <p className="text-red-500">Error loading space: {(error as any)?.message || "Not found"}</p>
        </div>
      </PageContainer>
    );
  }

  return (
      <main className="h-screen w-screen overflow-hidden bg-[#f9f9f9] dark:bg-[#0a0a0a]">
        <ReactFlowProvider>
          <CanvasView initialData={canvas} />
        </ReactFlowProvider>
      </main>
  );
};

export default SpaceCanvasPage;
