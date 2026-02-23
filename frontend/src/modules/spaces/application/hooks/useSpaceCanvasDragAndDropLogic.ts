// frontend/src/modules/spaces/application/hooks/useSpaceCanvasDragAndDropLogic.ts

import { useCallback } from 'react';
import type { Node } from '@xyflow/react';
import { SpaceCanvasDragAndDropInteractionLogic } from '../../domain/types';

export const useSpaceCanvasDragAndDropLogic = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>
): SpaceCanvasDragAndDropInteractionLogic => {
  const handleDragOverEvent = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDropEvent = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const dragAndDropTransferType = event.dataTransfer.getData('application/reactflow');
      const serializedTransferData = event.dataTransfer.getData('application/axon-data');

      if (!dragAndDropTransferType || !serializedTransferData) {
        return;
      }

      const deserializedTransferData = JSON.parse(serializedTransferData) as Record<string, unknown>;
      
      // If it was dragged as 'entity' from sidebar level 2, use its real type (agent, template, etc.)
      const nodeTypeForNewNode = dragAndDropTransferType === 'entity' 
        ? (deserializedTransferData.type as string) 
        : dragAndDropTransferType;

      const dropCoordinates = {
        x: event.clientX - 300,
        y: event.clientY - 100,
      };

      const newlyCreatedNode: Node = {
        id: `drag_and_drop_node_${Math.random()}`,
        type: nodeTypeForNewNode,
        position: dropCoordinates,
        data: {
          ...deserializedTransferData,
          state: 'missing_context',
        },
        style: nodeTypeForNewNode === 'zone' ? { width: 500, height: 400 } : undefined,
      };

      updateCanvasNodes((previousCanvasNodes) => previousCanvasNodes.concat(newlyCreatedNode));
    },
    [updateCanvasNodes],
  );

  return {
    handleDragOverEvent,
    handleDropEvent,
  };
};
