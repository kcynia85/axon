import { useState, useRef } from 'react';
import type { Node, Edge } from '@xyflow/react';
import { useReactFlow } from '@xyflow/react';
import { useSpaceCanvasState } from './useSpaceCanvasState';
import { useSpaceCanvasConnectionLogic } from './useSpaceCanvasConnectionLogic';
import { useSpaceCanvasDragAndDropLogic } from './useSpaceCanvasDragAndDropLogic';
import { useSpaceCanvasModificationOperations } from './useSpaceCanvasModificationOperations';
import { useSpaceCanvasHistory } from './useSpaceCanvasHistory';
import { useSpaceCanvasPersistence } from './useSpaceCanvasPersistence';
import { SpacePatternBlueprint } from '../../domain/types';
import { SpaceCanvasOrchestrationLogic } from '../../ui/types';
import { BlueprintEngine } from '../../domain/BlueprintEngine';
import React from 'react';

export const useSpaceCanvasOrchestrator = (spaceId: string, initialCanvasConfiguration?: unknown): SpaceCanvasOrchestrationLogic => {
  const {
    canvasNodes,
    canvasEdges,
    updateCanvasNodes,
    updateCanvasEdges,
    handleCanvasNodesChange,
    handleCanvasEdgesChange,
    currentlySelectedNode,
    latestNodesReference,
    latestEdgesReference
  } = useSpaceCanvasState(initialCanvasConfiguration);

  const { getViewport } = useReactFlow();
  const { mutate: persistCanvas } = useSpaceCanvasPersistence(spaceId);
  const debounceTimerReference = useRef<NodeJS.Timeout>();

  // Unified event-driven persistence function (Zero useEffect approach)
  const triggerDebouncedPersistence = () => {
      if (debounceTimerReference.current) clearTimeout(debounceTimerReference.current);
      
      debounceTimerReference.current = setTimeout(() => {
          // Always use the latest values from synchronous refs updated in setters
          // and fresh viewport from React Flow instance
          persistCanvas({ 
              nodes: latestNodesReference.current, 
              edges: latestEdgesReference.current,
              viewport: getViewport()
          });
      }, 1000); // Faster persistence (1s)
  };

  const updateCanvasNodesWithPersistence = (updater: any) => {
      updateCanvasNodes(updater);
      triggerDebouncedPersistence();
  };

  const updateCanvasEdgesWithPersistence = (updater: any) => {
      updateCanvasEdges(updater);
      triggerDebouncedPersistence();
  };

  const onNodesChangeWithPersistence = (changes: any) => {
      handleCanvasNodesChange(changes);
      // Synchronous ref update in handleCanvasNodesChange ensures we have latest data
      triggerDebouncedPersistence();
  };

  const onEdgesChangeWithPersistence = (changes: any) => {
      handleCanvasEdgesChange(changes);
      triggerDebouncedPersistence();
  };

  const { takeSnapshot, handleKeyDown } = useSpaceCanvasHistory(
    canvasNodes,
    canvasEdges,
    updateCanvasNodesWithPersistence,
    updateCanvasEdgesWithPersistence
  );

  const {
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
  } = useSpaceCanvasConnectionLogic(updateCanvasEdgesWithPersistence);

  const {
    handleDragOverEvent,
    handleDropEvent,
  } = useSpaceCanvasDragAndDropLogic(updateCanvasNodesWithPersistence);

  const {
    addNewNodeToCanvas,
    addMultipleNodesToCanvas,
    updateNodeDataOnCanvas,
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
  } = useSpaceCanvasModificationOperations(updateCanvasNodesWithPersistence, updateCanvasEdgesWithPersistence, takeSnapshot);

  const [clipboard, setClipboard] = useState<{ nodes: Node[]; isCut: boolean } | null>(null);

  const copyNodes = (nodes: Node[]) => {
    setClipboard({ nodes, isCut: false });
  };

  const cutNodes = (nodes: Node[]) => {
    setClipboard({ nodes, isCut: true });
  };

  const createPatternFromSelection = (name: string, description: string, type?: 'pattern' | 'super-pattern') => {
    const selectedNodesForBlueprint = canvasNodes.filter(node => node.selected);
    return BlueprintEngine.serializeSelection(
        selectedNodesForBlueprint as any, 
        canvasNodes as any, 
        canvasEdges as any, 
        { name, description, type }
    );
  };

  const instantiatePatternFromBlueprint = (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => {
    takeSnapshot();
    const { nodes: newNodes, edges: newEdges } = BlueprintEngine.instantiatePattern(blueprint, position);
    updateCanvasNodesWithPersistence((currentNodes: Node[]) => [...currentNodes, ...newNodes]);
    updateCanvasEdgesWithPersistence((currentEdges: Edge[]) => [...currentEdges, ...newEdges]);
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

    updateCanvasNodesWithPersistence((currentNodes: Node[]) => currentNodes.concat(newNodes));

    if (isCut) {
      const cutNodeIds = nodes.map(n => n.id);
      updateCanvasNodesWithPersistence((currentNodes: Node[]) => currentNodes.filter(n => !cutNodeIds.includes(n.id)));
      setClipboard(null);
    }
  };

  return {
    canvasNodes,
    canvasEdges,
    handleCanvasNodesChange: onNodesChangeWithPersistence,
    handleCanvasEdgesChange: onEdgesChangeWithPersistence,
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
    handleDragOverEvent,
    handleDropEvent,
    addNewNodeToCanvas,
    addMultipleNodesToCanvas,
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
