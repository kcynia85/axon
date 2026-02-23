// frontend/src/modules/spaces/application/hooks/useSpaceCanvasConnectionLogic.ts

import { useCallback } from 'react';
import { addEdge, useReactFlow } from '@xyflow/react';
import type { Connection, Edge } from '@xyflow/react';
import { SpaceCanvasConnectionManagementLogic } from '../../domain/types';

export const useSpaceCanvasConnectionLogic = (
  updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>
): SpaceCanvasConnectionManagementLogic => {
  const { getNodes } = useReactFlow();

  const handleNewConnectionCreated = useCallback(
    (connectionParameters: Connection) => {
      const currentCanvasNodes = getNodes();
      const sourceNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.source);
      const targetNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.target);

      const isConnectionBetweenTwoZones = 
        sourceNodeOfConnection?.type === 'zone' && targetNodeOfConnection?.type === 'zone';
      
      const visualStyleForNewEdge = { 
        stroke: '#666', 
        strokeWidth: isConnectionBetweenTwoZones ? 3 : 2 
      };

      updateCanvasEdges((previousCanvasEdges) => 
        addEdge(
          { ...connectionParameters, type: 'CustomEdge', style: visualStyleForNewEdge }, 
          previousCanvasEdges
        )
      );
    },
    [getNodes, updateCanvasEdges],
  );

  const validateConnectionBetweenNodes = useCallback(
    (connectionParameters: Connection) => {
      const currentCanvasNodes = getNodes();
      const sourceNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.source);
      const targetNodeOfConnection = currentCanvasNodes.find((node) => node.id === connectionParameters.target);

      if (!sourceNodeOfConnection || !targetNodeOfConnection) {
        return false;
      }

      const isSourceNodeRepresentingAZone = sourceNodeOfConnection.type === 'zone';
      const isTargetNodeRepresentingAZone = targetNodeOfConnection.type === 'zone';

      // 1. Zone to Zone is allowed
      if (isSourceNodeRepresentingAZone && isTargetNodeRepresentingAZone) {
        return true;
      }

      // 2. Zone to Entity (or vice versa) is NOT allowed
      if (isSourceNodeRepresentingAZone !== isTargetNodeRepresentingAZone) {
        return false;
      }

      // 3. Entity to Entity is allowed ONLY if they are in the same zone
      return sourceNodeOfConnection.parentId === targetNodeOfConnection.parentId;
    },
    [getNodes],
  );

  return {
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
  };
};
