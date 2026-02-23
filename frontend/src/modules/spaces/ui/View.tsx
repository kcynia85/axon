// frontend/src/modules/spaces/ui/View.tsx

"use client";

import React from 'react';
import { useSpaceCanvasOrchestrator } from '../application/hooks/useSpaceCanvasOrchestrator';
import { SpaceCanvasPresentationView } from './pure/SpaceCanvasPresentationView';
import { SpaceCanvasViewProperties } from '../domain/types';

export const SpaceCanvasView = ({ initialCanvasConfiguration }: SpaceCanvasViewProperties) => {
  const {
    canvasNodes,
    canvasEdges,
    handleCanvasNodesChange,
    handleCanvasEdgesChange,
    handleNewConnectionCreated,
    validateConnectionBetweenNodes,
    handleDragOverEvent,
    handleDropEvent,
    addNewNodeToCanvas,
    currentlySelectedNode,
    updateNodeDataOnCanvas,
  } = useSpaceCanvasOrchestrator(initialCanvasConfiguration);

  return (
    <SpaceCanvasPresentationView 
        canvasNodes={canvasNodes}
        canvasEdges={canvasEdges}
        handleCanvasNodesChange={handleCanvasNodesChange}
        handleCanvasEdgesChange={handleCanvasEdgesChange}
        handleNewConnectionCreated={handleNewConnectionCreated}
        validateConnectionBetweenNodes={validateConnectionBetweenNodes}
        handleDragOverEvent={handleDragOverEvent}
        handleDropEvent={handleDropEvent}
        addNewNodeToCanvas={addNewNodeToCanvas}
        updateNodeDataOnCanvas={updateNodeDataOnCanvas}
        currentlySelectedNode={currentlySelectedNode}
    />
  );
};
