// frontend/src/modules/spaces/application/hooks/useSpaceCanvasModificationOperations.ts

import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { mapTemplateWorkspaceConfigToNodeData } from '../../domain/defaults';

export const useSpaceCanvasModificationOperations = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  takeSnapshot: () => void
) => {
  const { getNodes } = useReactFlow();

  const addNewNodeToCanvas = (
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
    const templateCanvasData = isTemplate ? mapTemplateWorkspaceConfigToNodeData(initialNodeData) : {};

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
  };

  const updateNodeDataOnCanvas = (nodeId: string, newNodeData: Record<string, unknown>) => {
    updateCanvasNodes((previousCanvasNodes) =>
      previousCanvasNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newNodeData } } : node
      ),
    );
  };

  const duplicateNode = (node: Node) => {
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
  };

  const deleteNodes = (nodeIds: string[]) => {
    takeSnapshot();
    updateCanvasNodes((nodes) => nodes.filter((node) => !nodeIds.includes(node.id)));
    updateCanvasEdges((edges) => edges.filter((edge) => !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)));
  };

  const updateNodesStatus = (nodeIds: string[], status: string) => {
    updateCanvasNodes((nodes) =>
      nodes.map((node) => {
        if (nodeIds.includes(node.id)) {
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
  };

  return {
    addNewNodeToCanvas,
    updateNodeDataOnCanvas,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
  };
};
