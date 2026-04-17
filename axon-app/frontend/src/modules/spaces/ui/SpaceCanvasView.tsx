// frontend/src/modules/spaces/ui/SpaceCanvasView.tsx

"use client";

import React, { useEffect } from 'react';
import { useSpaceCanvasOrchestrator } from '../application/hooks/useSpaceCanvasOrchestrator';
import { SpaceCanvasPresentationView } from './pure/SpaceCanvasPresentationView';
import { useSpaceCanvasView } from './pure/useSpaceCanvasView';
import { SpaceCanvasViewProperties } from './types';
import { useSpaceQuery, usePersistCanvasMutation } from '../application/hooks';

export const SpaceCanvasView = ({ initialConfiguration, workspaceId }: SpaceCanvasViewProperties) => {
  const orchestrator = useSpaceCanvasOrchestrator(initialConfiguration);
  const canvasViewProperties = useSpaceCanvasView({ ...orchestrator, workspaceId });
  const { data: spaceData } = useSpaceQuery(workspaceId);
  const { mutate: persistCanvas, isPending: isSaving } = usePersistCanvasMutation();

  // Auto-save effect
  useEffect(() => {
    if (!workspaceId) return;

    const timer = setTimeout(() => {
        persistCanvas({
            spaceId: workspaceId,
            config: {
                nodes: orchestrator.canvasNodes as any,
                edges: orchestrator.canvasEdges as any,
                viewport: canvasViewProperties.viewport
            }
        });
    }, 1500);

    return () => clearTimeout(timer);
  }, [orchestrator.canvasNodes, orchestrator.canvasEdges, canvasViewProperties.viewport, workspaceId, persistCanvas]);

  return (
    <SpaceCanvasPresentationView 
        {...orchestrator}
        workspaceId={workspaceId}
        canvasViewProperties={canvasViewProperties}
        spaceData={spaceData}
        isSaving={isSaving}
    />
  );
};
