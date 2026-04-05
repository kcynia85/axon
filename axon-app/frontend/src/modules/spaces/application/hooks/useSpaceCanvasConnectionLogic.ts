// frontend/src/modules/spaces/application/hooks/useSpaceCanvasConnectionLogic.ts

import { addEdge, useReactFlow } from '@xyflow/react';
import type { Connection, Edge } from '@xyflow/react';
import { SpaceCanvasConnectionManagementLogic } from '../../domain/types';

export const useSpaceCanvasConnectionLogic = (
  updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>
): SpaceCanvasConnectionManagementLogic => {
  const { getNodes } = useReactFlow();

  const handleNewConnectionCreated = (connectionParameters: Connection) => {
    const currentCanvasNodes = getNodes();
    const sourceNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.source);
    const targetNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.target);

    const isConnectionBetweenTwoZones = 
      sourceNodeOfConnection?.type === 'zone' && targetNodeOfConnection?.type === 'zone';
    
    const isBoundaryConnection = 
      (sourceNodeOfConnection?.type === 'zone' && targetNodeOfConnection?.parentId === sourceNodeOfConnection?.id) ||
      (targetNodeOfConnection?.type === 'zone' && sourceNodeOfConnection?.parentId === targetNodeOfConnection?.id);

    const visualStyleForNewEdge = { 
      stroke: isBoundaryConnection ? '#aaa' : '#666', 
      strokeWidth: isConnectionBetweenTwoZones ? 3 : 2,
      strokeDasharray: isBoundaryConnection ? '5,5' : 'none'
    };

    updateCanvasEdges((previousCanvasEdges) => 
      addEdge(
        { ...connectionParameters, type: 'CustomEdge', style: visualStyleForNewEdge }, 
        previousCanvasEdges
      )
    );
  };

  const validateConnectionBetweenNodes = (connectionParameters: Connection) => {
    if (connectionParameters.source === connectionParameters.target) {
      return false;
    }

    const currentCanvasNodes = getNodes();
    const sourceNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.source);
    const targetNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.target);

    if (!sourceNodeOfConnection || !targetNodeOfConnection) {
      return false;
    }

    const isSourceNodeRepresentingAZone = sourceNodeOfConnection.type === 'zone';
    const isTargetNodeRepresentingAZone = targetNodeOfConnection.type === 'zone';

    if (isSourceNodeRepresentingAZone && isTargetNodeRepresentingAZone) {
      return true;
    }

    if (isSourceNodeRepresentingAZone && targetNodeOfConnection.parentId === sourceNodeOfConnection.id) {
      return connectionParameters.sourceHandle?.endsWith('-int') ?? false;
    }

    if (isTargetNodeRepresentingAZone && sourceNodeOfConnection.parentId === targetNodeOfConnection.id) {
      return connectionParameters.targetHandle?.endsWith('-int') ?? false;
    }

    if (isSourceNodeRepresentingAZone || isTargetNodeRepresentingAZone) {
      return false;
    }

    return sourceNodeOfConnection.parentId === targetNodeOfConnection.parentId;
  };

  return {
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
  };
};
