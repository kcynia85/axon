// frontend/src/modules/spaces/ui/View.tsx

"use client";

import React from 'react';
import { useSpaceCanvasOrchestrator } from '../application/hooks/useSpaceCanvasOrchestrator';
import { SpaceCanvasPresentationView } from './pure/SpaceCanvasPresentationView';
import { SpaceCanvasViewProperties } from '../domain/types';

export const SpaceCanvasView = ({ initialConfiguration, workspaceId }: SpaceCanvasViewProperties) => {
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
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
    copyNodes,
    cutNodes,
    pasteNodes,
    createPatternFromSelection,
    instantiatePatternFromBlueprint,
    handleKeyDown,
  } = useSpaceCanvasOrchestrator(initialConfiguration);

  return (
    <SpaceCanvasPresentationView 
        workspaceId={workspaceId}
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
        duplicateNode={duplicateNode}
        deleteNodes={deleteNodes}
        updateNodesStatus={updateNodesStatus}
        copyNodes={copyNodes}
        cutNodes={cutNodes}
        pasteNodes={pasteNodes}
        createPatternFromSelection={createPatternFromSelection}
        instantiatePatternFromBlueprint={instantiatePatternFromBlueprint}
        handleKeyDown={handleKeyDown}
    />
  );
};

