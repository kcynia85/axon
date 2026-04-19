// frontend/src/modules/spaces/ui/SpaceCanvasView.tsx

"use client";

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useReactFlow } from '@xyflow/react';
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
  const searchParams = useSearchParams();
  const { setCenter, getNodes } = useReactFlow();
  
  const { data: agents = [] } = useAgents(workspaceId);
  const { data: crews = [] } = useCrews(workspaceId);

  // Handle deep linking to specific nodes (e.g. from Project Studio artifacts)
  useEffect(() => {
    const focusNodeId = searchParams.get('focus_node');
    if (focusNodeId && orchestrator.canvasNodes.length > 0) {
        const node = orchestrator.canvasNodes.find(n => n.id === focusNodeId);
        if (node) {
            // 1. Select the node
            orchestrator.handleCanvasNodesChange([{
                id: focusNodeId,
                type: 'select',
                selected: true
            }]);

            // 2. Center the view on the node
            const x = node.position.x + (node.measured?.width ?? 200) / 2;
            const y = node.position.y + (node.measured?.height ?? 100) / 2;
            setCenter(x, y, { zoom: 1.2, duration: 800 });
        }
    }
  }, [searchParams, orchestrator.canvasNodes.length, setCenter]);

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
