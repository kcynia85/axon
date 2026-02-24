// frontend/src/modules/spaces/application/hooks/useSpaceCanvasModificationOperations.ts

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node } from '@xyflow/react';
import { mapTemplateWorkspaceConfigToNodeData } from '../../domain/defaults';

export const useSpaceCanvasModificationOperations = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const { getNodes } = useReactFlow();

  const addNewNodeToCanvas = useCallback((
    nodeType: string,
    initialNodeData: Record<string, unknown>,
    targetWorkspaceId: string
  ) => {
    const currentCanvasNodes = getNodes();
    const parentZoneForNewNode = currentCanvasNodes.find(
      (node) => node.type === 'zone' && node.data.type === targetWorkspaceId
    );

    let newNodePosition = { x: 100, y: 100 };
    let parentZoneId: string | undefined = undefined;

    if (parentZoneForNewNode) {
      parentZoneId = parentZoneForNewNode.id;
      newNodePosition = {
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 100
      };
    }

    const uniqueNodeIdentifier = `node_${Math.random().toString(36).substring(2, 11)}`;

    const isTemplate = nodeType === 'template';

    // Map template_inputs/outputs (from Workspace config) → contexts/artefacts (canvas node)
    const templateCanvasData = isTemplate
      ? mapTemplateWorkspaceConfigToNodeData(initialNodeData)
      : {};

    const newlyCreatedNode: Node = {
      id: uniqueNodeIdentifier,
      type: nodeType,
      position: newNodePosition,
      parentId: parentZoneId,
      extent: parentZoneId ? 'parent' : undefined,
      data: {
        ...initialNodeData,
        ...templateCanvasData,
        ...(isTemplate && { actions: [], status: 'working' }),
        state: 'missing_context',
      },
    };

    updateCanvasNodes((previousCanvasNodes) => previousCanvasNodes.concat(newlyCreatedNode));
  }, [getNodes, updateCanvasNodes]);

  const updateNodeDataOnCanvas = useCallback((nodeId: string, newNodeData: Record<string, unknown>) => {
    updateCanvasNodes((previousCanvasNodes) =>
      previousCanvasNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newNodeData } } : node
      ),
    );
  }, [updateCanvasNodes]);

  return {
    addNewNodeToCanvas,
    updateNodeDataOnCanvas,
  };
};
