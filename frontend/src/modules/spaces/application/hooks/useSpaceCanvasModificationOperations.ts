// frontend/src/modules/spaces/application/hooks/useSpaceCanvasModificationOperations.ts

import { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { mapTemplateWorkspaceConfigToNodeData } from '../../domain/defaults';

export const useSpaceCanvasModificationOperations = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  takeSnapshot: () => void
) => {
  const { getNodes } = useReactFlow();

  const addNewNodeToCanvas = useCallback((
    nodeType: string,
    initialNodeData: Record<string, unknown>,
    targetWorkspaceId: string
  ) => {
    takeSnapshot();
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
  }, [getNodes, updateCanvasNodes, takeSnapshot]);

  const updateNodeDataOnCanvas = useCallback((nodeId: string, newNodeData: Record<string, unknown>) => {
    updateCanvasNodes((previousCanvasNodes) =>
      previousCanvasNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newNodeData } } : node
      ),
    );
  }, [updateCanvasNodes]);

  const duplicateNode = useCallback((node: Node) => {
    takeSnapshot();
    const uniqueNodeIdentifier = `node_${Math.random().toString(36).substring(2, 11)}`;
    const duplicatedNode: Node = {
      ...node,
      id: uniqueNodeIdentifier,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      selected: false,
    };
    updateCanvasNodes((nodes) => nodes.concat(duplicatedNode));
  }, [updateCanvasNodes, takeSnapshot]);

  const deleteNodes = useCallback((nodeIds: string[]) => {
    takeSnapshot();
    // 1. Remove nodes
    updateCanvasNodes((nodes) => nodes.filter((node) => !nodeIds.includes(node.id)));
    // 2. Remove associated edges
    updateCanvasEdges((edges) => edges.filter((edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)));
  }, [updateCanvasNodes, updateCanvasEdges, takeSnapshot]);

  const updateNodesStatus = useCallback((nodeIds: string[], status: string) => {
    updateCanvasNodes((nodes) =>
      nodes.map((node) => {
        if (nodeIds.includes(node.id)) {
          // Different node types might use different status fields
          const isService = node.type === 'service';
          const statusField = isService ? 'status' : 'state';
          return {
            ...node,
            data: {
              ...node.data,
              [statusField]: status,
            },
          };
        }
        return node;
      })
    );
  }, [updateCanvasNodes]);

  return {
    addNewNodeToCanvas,
    updateNodeDataOnCanvas,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
  };
};
