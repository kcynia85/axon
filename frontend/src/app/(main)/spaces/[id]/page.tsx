"use client";

import { useSpaceCanvas } from "@/modules/spaces/application/use-space-canvas";
import { CanvasView } from "@/modules/spaces/ui/canvas-view";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { useParams } from "next/navigation";

export default function SpaceCanvasPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: canvas, isLoading, error } = useSpaceCanvas(id);

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
          <p className="text-red-500">Error loading space: {(error as Error)?.message || "Not found"}</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="h-screen flex flex-col p-0">
      <main className="flex-1 min-h-0">
        <CanvasView initialData={canvas} />
      </main>
    </PageContainer>
  );
}
