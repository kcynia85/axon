// frontend/src/modules/spaces/ui/SpaceCanvasView.tsx

"use client";

import React, { useEffect } from 'react';
import { useAgents } from "@/modules/agents/infrastructure/useAgents";
import { useCrews } from "@/modules/workspaces/application/useCrews";
import { useSpaceCanvasOrchestrator } from '../application/hooks/useSpaceCanvasOrchestrator';
import { SpaceCanvasPresentationView } from './pure/SpaceCanvasPresentationView';
import { useSpaceCanvasView } from './pure/useSpaceCanvasView';
import { SpaceCanvasViewProperties } from './types';
import { useSpaceQuery } from '../application/hooks';

export const SpaceCanvasView = ({ initialConfiguration, workspaceId }: SpaceCanvasViewProperties) => {
  const orchestrator = useSpaceCanvasOrchestrator(workspaceId, initialConfiguration);
  const canvasViewProperties = useSpaceCanvasView({ ...orchestrator, workspaceId });
  const { data: spaceData } = useSpaceQuery(workspaceId);
  
  const { data: agents = [] } = useAgents(workspaceId);
  const { data: crews = [] } = useCrews(workspaceId);

  return (
    <SpaceCanvasPresentationView 
        {...orchestrator}
        workspaceId={workspaceId}
        canvasViewProperties={canvasViewProperties}
        spaceData={spaceData}
        isSaving={false}
        availableAgents={agents}
        availableCrews={crews}
    />
  );
};
