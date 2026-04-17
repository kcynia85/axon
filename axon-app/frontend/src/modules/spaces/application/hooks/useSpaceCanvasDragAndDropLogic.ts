// frontend/src/modules/spaces/application/hooks/useSpaceCanvasDragAndDropLogic.ts

import type { Node } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { toast } from "sonner";
import { 
  mapTemplateWorkspaceConfigToNodeData,
  mapAgentWorkspaceConfigToNodeData,
  mapCrewWorkspaceConfigToNodeData,
  mapServiceWorkspaceConfigToNodeData,
  mapAutomationWorkspaceConfigToNodeData
} from '../../domain/defaults';
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from '../../domain/constants';

export const useSpaceCanvasDragAndDropLogic = (
  updateCanvasNodes: React.Dispatch<React.SetStateAction<Node[]>>
) => {
  const { screenToFlowPosition, getNodes } = useReactFlow();

  const handleDragOverEvent = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const handleDropEvent = (event: React.DragEvent) => {
    event.preventDefault();

    const dragAndDropTransferType = event.dataTransfer.getData('application/reactflow');
    const serializedTransferData = event.dataTransfer.getData('application/axon-data');

    if (!dragAndDropTransferType || !serializedTransferData) return;

    const deserializedTransferData = JSON.parse(serializedTransferData) as Record<string, unknown>;
    const assignedZoneColor = deserializedTransferData.zoneColor as string | undefined;
    const componentLabel = (deserializedTransferData.label as string) || "Component";

    const nodeTypeForNewNode = dragAndDropTransferType === 'entity'
      ? (deserializedTransferData.type as string)
      : dragAndDropTransferType;

    const flowPos = screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const allNodes = getNodes();
    
    let parentZone = [...allNodes].reverse().find(node => {
      if (node.type !== 'zone') return false;
      
      let absX = node.position.x;
      let absY = node.position.y;
      let parentId = node.parentId;
      while (parentId) {
        const parent = allNodes.find(n => n.id === parentId);
        if (parent) {
          absX += parent.position.x;
          absY += parent.position.y;
          parentId = parent.parentId;
        } else break;
      }

      const width = node.measured?.width ?? (typeof node.style?.width === 'number' ? node.style.width : 500);
      const height = node.measured?.height ?? (typeof node.style?.height === 'number' ? node.style.height : 400);

      const isInside = (flowPos.x >= absX && flowPos.x <= absX + width && flowPos.y >= absY && flowPos.y <= absY + height);
      if (!isInside) return false;

      if (assignedZoneColor && node.data.color !== assignedZoneColor && node.data.zoneColor !== assignedZoneColor) {
        toast.error("Ograniczenie Workspace", {
          description: `${componentLabel} może zostać umieszczony tylko w sekcji Design / ${assignedZoneColor.toUpperCase()}.`,
          duration: 4000,
        });
        return false;
      }
      return true;
    });

    let extraNodes: Node[] = [];
    if (assignedZoneColor && !parentZone) {
        // Automatically create a zone if it doesn't exist for the assigned color
        const zoneId = `zone_${assignedZoneColor}_${Math.random().toString(36).substring(2, 11)}`;
        const workspaceUnit = Object.entries(MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS).find(([_, color]) => color === assignedZoneColor);
        const workspaceLabel = workspaceUnit ? workspaceUnit[0].replace('ws-', '').toUpperCase() : assignedZoneColor.toUpperCase();

        parentZone = {
            id: zoneId,
            type: 'zone',
            position: { x: flowPos.x - 250, y: flowPos.y - 200 },
            data: {
                label: workspaceLabel,
                color: assignedZoneColor,
                zoneColor: assignedZoneColor,
            },
            style: { width: 500, height: 400 },
        };
        extraNodes.push(parentZone);
    }

    if (assignedZoneColor && !parentZone) return;

    let entityCanvasData = {};
    if (nodeTypeForNewNode === 'template') {
        entityCanvasData = {
            ...mapTemplateWorkspaceConfigToNodeData(deserializedTransferData),
            actions: [],
            status: 'working'
        };
    } else if (nodeTypeForNewNode === 'agent') {
        entityCanvasData = mapAgentWorkspaceConfigToNodeData(deserializedTransferData);
    } else if (nodeTypeForNewNode === 'crew') {
        entityCanvasData = mapCrewWorkspaceConfigToNodeData(deserializedTransferData);
    } else if (nodeTypeForNewNode === 'service') {
        entityCanvasData = mapServiceWorkspaceConfigToNodeData(deserializedTransferData);
    } else if (nodeTypeForNewNode === 'automation') {
        entityCanvasData = mapAutomationWorkspaceConfigToNodeData(deserializedTransferData);
    }

    let finalPosition = flowPos;
    if (parentZone && nodeTypeForNewNode !== 'zone') {
      let absX = parentZone.position.x;
      let absY = parentZone.position.y;
      let parentId = parentZone.parentId;
      while (parentId) {
        const parent = allNodes.find(n => n.id === parentId);
        if (parent) {
          absX += parent.position.x;
          absY += parent.position.y;
          parentId = parent.parentId;
        } else break;
      }
      finalPosition = { x: flowPos.x - absX, y: flowPos.y - absY };
    }

    const newlyCreatedNode: Node = {
      id: `drag_and_drop_node_${Math.random().toString(36).substring(2, 11)}`,
      type: nodeTypeForNewNode,
      position: finalPosition,
      parentId: (parentZone && nodeTypeForNewNode !== 'zone') ? parentZone.id : undefined,
      extent: (parentZone && nodeTypeForNewNode !== 'zone') ? 'parent' : undefined,
      data: {
        ...deserializedTransferData,
        state: 'missing_context',
        zoneColor: assignedZoneColor || (parentZone ? (parentZone.data.color || parentZone.data.zoneColor) : 'purple'),
        ...entityCanvasData, // Merging entity-specific data (tasks, roles, mapped types) last
      },
      style: nodeTypeForNewNode === 'zone' ? { width: 500, height: 400 } : undefined,
    };

    updateCanvasNodes((previousCanvasNodes) => [...extraNodes, ...previousCanvasNodes, newlyCreatedNode]);
  };

  return { handleDragOverEvent, handleDropEvent };
};
