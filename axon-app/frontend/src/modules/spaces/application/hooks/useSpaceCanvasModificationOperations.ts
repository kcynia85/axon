// frontend/src/modules/spaces/application/hooks/useSpaceCanvasModificationOperations.ts

import { useReactFlow } from '@xyflow/react';
import type { Node, Edge } from '@xyflow/react';
import { mapTemplateWorkspaceConfigToNodeData } from '../../domain/defaults';
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from '../../domain/constants';

export const useSpaceCanvasModificationOperations = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>,
  updateCanvasEdges: React.Dispatch<React.SetStateAction<Edge[]>>,
  takeSnapshot: () => void
) => {
  const { getNodes } = useReactFlow();

  const addMultipleNodesToCanvas = (
    nodesToAdd: Array<{ type: string; data: Record<string, unknown>; workspaceId: string }>
  ): string[] => {
    takeSnapshot();
    const currentCanvasNodes = [...getNodes()];
    const newNodes: Node[] = [];
    const createdIds: string[] = [];

    for (const item of nodesToAdd) {
      const expectedColor = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[item.workspaceId];
      
      // Check in both existing nodes AND nodes added in this batch
      let parentZone = [...currentCanvasNodes, ...newNodes].find(
        (node) => node.type === 'zone' && (node.data.color === expectedColor || node.data.type === item.workspaceId)
      );

      if (!parentZone && expectedColor) {
        const zoneId = `zone_${expectedColor}_${Math.random().toString(36).substring(2, 11)}`;
        const workspaceLabel = item.workspaceId.replace('ws-', '').toUpperCase();
        
        parentZone = {
          id: zoneId,
          type: 'zone',
          position: { x: 100 + (newNodes.length * 100), y: 100 }, 
          data: {
            label: workspaceLabel,
            color: expectedColor,
            zoneColor: expectedColor,
            type: item.workspaceId,
            ports: []
          },
          style: { width: 500, height: 400 },
        };
        newNodes.push(parentZone);
      }

      const uniqueId = `node_${Math.random().toString(36).substring(2, 11)}`;
      const isTemplate = item.type === 'template' || (item.data as any).type === 'template';
      const isCrew = item.type === 'crew' || (item.data as any).type === 'crew';
      
      const templateCanvasData = isTemplate ? mapTemplateWorkspaceConfigToNodeData(item.data) : {};
      const crewCanvasData = isCrew ? {
          state: 'idle',
          tasks: [],
          members: (item.data as any).members || (item.data as any).agent_member_ids || [],
          resolved_members: (item.data as any).resolved_members || (item.data as any)._resolved_members || [],
          resolved_manager: (item.data as any).resolved_manager || (item.data as any)._resolved_manager || null,
          process_type: (item.data as any).crew_process_type || (item.data as any).process_type || 'Sequential',
      } : {};

      const newNode: Node = {
        id: uniqueId,
        type: isCrew ? 'crew' : (isTemplate ? 'template' : item.type),
        position: { x: 50 + Math.random() * 200, y: 50 + Math.random() * 200 },
        parentId: parentZone?.id,
        extent: parentZone?.id ? 'parent' : undefined,
        data: {
          ...item.data,
          ...templateCanvasData,
          ...crewCanvasData,
          ...(isTemplate && { actions: [], status: 'working' }),
          state: 'missing_context',
          zoneColor: expectedColor || 'purple'
        },
      };

      newNodes.push(newNode);
      createdIds.push(uniqueId);
    }

    updateCanvasNodes((prev) => [...prev, ...newNodes]);
    return createdIds;
  };

  const addNewNodeToCanvas = (
    nodeType: string,
    initialNodeData: Record<string, unknown>,
    targetWorkspaceId: string
  ): string => {
    const ids = addMultipleNodesToCanvas([{ type: nodeType, data: initialNodeData, workspaceId: targetWorkspaceId }]);
    return ids[0];
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
    addMultipleNodesToCanvas,
    updateNodeDataOnCanvas,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
  };
};
