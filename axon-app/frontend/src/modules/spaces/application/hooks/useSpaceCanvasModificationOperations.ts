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

  const addNewNodeToCanvas = (
    nodeType: string,
    initialNodeData: Record<string, unknown>,
    targetWorkspaceId: string
  ) => {
    takeSnapshot();
    const currentCanvasNodes = getNodes();
    
    // Map targetWorkspaceId to the expected zone color/type
    const expectedColor = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[targetWorkspaceId];
    
    let parentZoneForNewNode = currentCanvasNodes.find(
      (node) => node.type === 'zone' && (node.data.color === expectedColor || node.data.type === targetWorkspaceId)
    );

    let extraNodes: Node[] = [];
    if (!parentZoneForNewNode && expectedColor) {
      // Create zone if it doesn't exist
      const zoneId = `zone_${expectedColor}_${Math.random().toString(36).substring(2, 11)}`;
      const workspaceLabel = targetWorkspaceId.replace('ws-', '').toUpperCase();
      
      parentZoneForNewNode = {
        id: zoneId,
        type: 'zone',
        position: { x: 100, y: 100 }, // Default position for new zone
        data: {
          label: workspaceLabel,
          color: expectedColor,
          zoneColor: expectedColor,
          type: targetWorkspaceId
        },
        style: { width: 500, height: 400 },
      };
      extraNodes.push(parentZoneForNewNode);
    }

    let newNodePosition = { x: 100, y: 100 };
    let parentZoneId: string | undefined = parentZoneForNewNode?.id;

    if (parentZoneForNewNode) {
      newNodePosition = {
        x: 50 + Math.random() * 100,
        y: 50 + Math.random() * 100
      };
    }

    const uniqueNodeIdentifier = `node_${Math.random().toString(36).substring(2, 11)}`;
    const isTemplate = nodeType === 'template' || (initialNodeData as any).type === 'template';
    const isCrew = nodeType === 'crew' || (initialNodeData as any).type === 'crew';
    
    const templateCanvasData = isTemplate ? mapTemplateWorkspaceConfigToNodeData(initialNodeData) : {};
    
    // Hydrate crew data if missing
    const crewCanvasData = isCrew ? {
        state: 'idle',
        tasks: [],
        members: (initialNodeData as any).members || (initialNodeData as any).agent_member_ids || [],
        resolved_members: (initialNodeData as any).resolved_members || (initialNodeData as any)._resolved_members || [],
        resolved_manager: (initialNodeData as any).resolved_manager || (initialNodeData as any)._resolved_manager || null,
        process_type: (initialNodeData as any).crew_process_type || (initialNodeData as any).process_type || 'Sequential',
    } : {};

    const newlyCreatedNode: Node = {
      id: uniqueNodeIdentifier,
      type: isCrew ? 'crew' : (isTemplate ? 'template' : nodeType),
      position: newNodePosition,
      parentId: parentZoneId,
      extent: parentZoneId ? 'parent' : undefined,
      data: {
        ...initialNodeData,
        ...templateCanvasData,
        ...crewCanvasData,
        ...(isTemplate && { actions: [], status: 'working' }),
        state: 'missing_context',
        zoneColor: expectedColor || parentZoneForNewNode?.data.zoneColor || 'purple'
      },
    };

    updateCanvasNodes((previousCanvasNodes) => [...extraNodes, ...previousCanvasNodes, newlyCreatedNode]);
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
