// frontend/src/modules/spaces/application/hooks/useSpaceCanvasOrchestrator.ts

import { useState } from 'react';
import type { Node } from '@xyflow/react';
import { useSpaceCanvasState } from './useSpaceCanvasState';
import { useSpaceCanvasConnectionLogic } from './useSpaceCanvasConnectionLogic';
import { useSpaceCanvasDragAndDropLogic } from './useSpaceCanvasDragAndDropLogic';
import { useSpaceCanvasModificationOperations } from './useSpaceCanvasModificationOperations';
import { useSpaceCanvasHistory } from './useSpaceCanvasHistory';
import { SpacePatternBlueprint } from '../../domain/types';
import { SpaceCanvasOrchestrationLogic } from '../../ui/types';
import { BlueprintEngine } from '../../domain/BlueprintEngine';

export const useSpaceCanvasOrchestrator = (initialCanvasConfiguration?: unknown): SpaceCanvasOrchestrationLogic => {
  const {
    canvasNodes,
    canvasEdges,
    updateCanvasNodes,
    updateCanvasEdges,
    handleCanvasNodesChange,
    handleCanvasEdgesChange,
    currentlySelectedNode,
  } = useSpaceCanvasState(initialCanvasConfiguration);

  const { takeSnapshot, handleKeyDown } = useSpaceCanvasHistory(
    canvasNodes,
    canvasEdges,
    updateCanvasNodes,
    updateCanvasEdges
  );

  const {
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
  } = useSpaceCanvasConnectionLogic(updateCanvasEdges);

  const {
    handleDragOverEvent,
    handleDropEvent,
  } = useSpaceCanvasDragAndDropLogic(updateCanvasNodes);

  const {
    addNewNodeToCanvas,
    updateNodeDataOnCanvas,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
  } = useSpaceCanvasModificationOperations(updateCanvasNodes, updateCanvasEdges, takeSnapshot);

  const [clipboard, setClipboard] = useState<{ nodes: Node[]; isCut: boolean } | null>(null);

  const copyNodes = (nodes: Node[]) => {
    setClipboard({ nodes, isCut: false });
  };

  const cutNodes = (nodes: Node[]) => {
    setClipboard({ nodes, isCut: true });
  };

  const createPatternFromSelection = (name: string, description: string, type?: 'pattern' | 'super-pattern') => {
    const selectedNodes = canvasNodes.filter(n => n.selected);
    return BlueprintEngine.serializeSelection(selectedNodes as any, canvasNodes as any, canvasEdges as any, { name, description, type });
  };

  const instantiatePatternFromBlueprint = (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => {
    takeSnapshot();
    const { nodes, edges } = BlueprintEngine.instantiatePattern(blueprint, position);
    updateCanvasNodes(current => [...current, ...nodes]);
    updateCanvasEdges(current => [...current, ...edges]);
  };

  const pasteNodes = (position?: { x: number; y: number }) => {
    if (!clipboard) return;

    takeSnapshot();
    const { nodes, isCut } = clipboard;
    
    const newNodes = nodes.map((node) => {
      const uniqueId = `node_${Math.random().toString(36).substring(2, 11)}`;
      return {
        ...node,
        id: uniqueId,
        position: position 
          ? { x: position.x + (node.position.x - nodes[0].position.x), y: position.y + (node.position.y - nodes[0].position.y) }
          : { x: node.position.x + 50, y: node.position.y + 50 },
        selected: false,
      };
    });

    updateCanvasNodes((currentNodes) => currentNodes.concat(newNodes));

    if (isCut) {
      const cutNodeIds = nodes.map(n => n.id);
      updateCanvasNodes((currentNodes) => currentNodes.filter(n => !cutNodeIds.includes(n.id)));
      setClipboard(null);
    }
  };

  return {
    canvasNodes,
    canvasEdges,
    handleCanvasNodesChange,
    handleCanvasEdgesChange,
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
    handleDragOverEvent,
    handleDropEvent,
    addNewNodeToCanvas,
    updateNodeDataOnCanvas,
    currentlySelectedNode,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
    copyNodes,
    cutNodes,
    pasteNodes,
    createPatternFromSelection,
    instantiatePatternFromBlueprint,
    handleKeyDown,
  };
};
