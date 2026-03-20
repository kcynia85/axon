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
    },
    [getNodes, updateCanvasEdges],
  );

  const validateConnectionBetweenNodes = useCallback(
    (connectionParameters: Connection) => {
      // 0. Prevent self-connections (Input to Output within the same Node)
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

      // 1. Zone to Zone is allowed
      if (isSourceNodeRepresentingAZone && isTargetNodeRepresentingAZone) {
        return true;
      }

      // 2. Boundary Connection: Child to Parent Zone
      if (isSourceNodeRepresentingAZone && targetNodeOfConnection.parentId === sourceNodeOfConnection.id) {
        // Parent Zone to its Child: Allowed if using internal handle
        return connectionParameters.sourceHandle?.endsWith('-int') ?? false;
      }

      if (isTargetNodeRepresentingAZone && sourceNodeOfConnection.parentId === targetNodeOfConnection.id) {
        // Child to its Parent Zone: Allowed if using internal handle
        return connectionParameters.targetHandle?.endsWith('-int') ?? false;
      }

      // 3. Zone to OTHER Entity (not its child) is NOT allowed
      if (isSourceNodeRepresentingAZone || isTargetNodeRepresentingAZone) {
        return false;
      }

      // 4. Entity to Entity is allowed ONLY if they are in the same zone
      return sourceNodeOfConnection.parentId === targetNodeOfConnection.parentId;
    },
    [getNodes],
  );

  return {
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
  };
};
