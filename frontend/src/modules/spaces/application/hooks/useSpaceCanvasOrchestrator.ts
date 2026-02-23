// frontend/src/modules/spaces/application/hooks/useSpaceCanvasOrchestrator.ts

import { useSpaceCanvasState } from './useSpaceCanvasState';
import { useSpaceCanvasConnectionLogic } from './useSpaceCanvasConnectionLogic';
import { useSpaceCanvasDragAndDropLogic } from './useSpaceCanvasDragAndDropLogic';
import { useSpaceCanvasModificationOperations } from './useSpaceCanvasModificationOperations';
import { SpaceCanvasOrchestrationLogic } from '../../domain/types';

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
  } = useSpaceCanvasModificationOperations(updateCanvasNodes);

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
  };
};
