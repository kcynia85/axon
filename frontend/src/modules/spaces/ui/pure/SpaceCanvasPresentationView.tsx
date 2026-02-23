// frontend/src/modules/spaces/ui/pure/SpaceCanvasPresentationView.tsx

import React from 'react';
import { ReactFlow, Controls, Background, Panel, BackgroundVariant } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';

import { SpaceZoneCanvasNode } from '../nodes/SpaceZoneCanvasNode';
import { SpaceAgentCanvasNode } from '../nodes/SpaceAgentCanvasNode';
import { SpaceCrewCanvasNode } from '../nodes/SpaceCrewCanvasNode';
import { SpacePatternCanvasNode } from '../nodes/SpacePatternCanvasNode';
import { SpaceAutomationCanvasNode } from '../nodes/SpaceAutomationCanvasNode';
import { SpaceTemplateCanvasNode } from '../nodes/SpaceTemplateCanvasNode';
import { SpaceServiceCanvasNode } from '../nodes/SpaceServiceCanvasNode';
import { SpaceEntityCanvasNode } from '../nodes/SpaceEntityCanvasNode';
import SpaceCanvasCustomEdge from '../edges/SpaceCanvasCustomEdge';

import { SpaceCanvasHeader } from '../SpaceCanvasHeader';
import { SpaceCanvasLeftSidebar } from '../SpaceCanvasLeftSidebar';
import { SpaceCanvasRightSidebar } from '../SpaceCanvasRightSidebar';

import "@xyflow/react/dist/style.css";

const canvasNodeComponents = {
  zone: SpaceZoneCanvasNode,
  agent: SpaceAgentCanvasNode,
  crew: SpaceCrewCanvasNode,
  pattern: SpacePatternCanvasNode,
  automation: SpaceAutomationCanvasNode,
  template: SpaceTemplateCanvasNode,
  service: SpaceServiceCanvasNode,
  entity: SpaceEntityCanvasNode,
};

const canvasEdgeComponents = {
  'CustomEdge': SpaceCanvasCustomEdge,
};

type SpaceCanvasPresentationViewProperties = {
    readonly canvasNodes: Node[];
    readonly canvasEdges: Edge[];
    readonly handleCanvasNodesChange: OnNodesChange;
    readonly handleCanvasEdgesChange: OnEdgesChange;
    readonly handleNewConnectionCreated: (connection: Connection) => void;
    readonly validateConnectionBetweenNodes: (connection: Connection) => boolean;
    readonly handleDragOverEvent: (event: React.DragEvent) => void;
    readonly handleDropEvent: (event: React.DragEvent) => void;
    readonly addNewNodeToCanvas: (type: string, data: Record<string, unknown>, workspace: string) => void;
    readonly updateNodeDataOnCanvas: (nodeId: string, data: Record<string, unknown>) => void;
    readonly currentlySelectedNode: Node | null;
};

export const SpaceCanvasPresentationView = ({
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
}: SpaceCanvasPresentationViewProperties) => {
  return (
    <div className="w-full h-full relative bg-black font-mono text-white selection:bg-purple-500/30">
      <SpaceCanvasHeader 
        activeSpaceDisplayName="Project Phoenix" 
        parentProjectDisplayName="Axon Redesign" 
        parentProjectIdentifier="axon-redesign" 
      />

      <ReactFlow
        nodes={canvasNodes}
        edges={canvasEdges}
        onNodesChange={handleCanvasNodesChange}
        onEdgesChange={handleCanvasEdgesChange}
        onConnect={handleNewConnectionCreated}
        isValidConnection={validateConnectionBetweenNodes}
        nodeTypes={canvasNodeComponents}
        edgeTypes={canvasEdgeComponents}
        onDragOver={handleDragOverEvent}
        onDrop={handleDropEvent}
        fitView
        attributionPosition="bottom-right"
        className="bg-black"
        minZoom={0.05}
        maxZoom={2}
        onlyRenderVisibleElements={true}
        nodeDragThreshold={5}
        selectNodesOnDrag={false}
        panOnScroll={true}
        selectionOnDrag={true}
        defaultEdgeOptions={{
            type: 'CustomEdge',
            style: { stroke: '#666', strokeWidth: 2 }
        }}
      >
        <Background color="#1a1a1a" gap={20} size={1} variant={BackgroundVariant.Dots} />

        <Panel position="bottom-right" className="z-50 pointer-events-auto m-4">
          <Controls className="bg-zinc-900 border border-zinc-200 rounded-lg shadow-2xl p-1 fill-white stroke-white" />
        </Panel>

        <Panel position="top-left" className="m-0 z-50">
          <SpaceCanvasLeftSidebar onAddComponent={addNewNodeToCanvas} />
        </Panel>

        <Panel position="top-right" className="m-0 z-50">
          <SpaceCanvasRightSidebar 
            currentlySelectedNodeInformation={currentlySelectedNode ? {
              id: currentlySelectedNode.id,
              type: currentlySelectedNode.type || 'unknown',
              data: currentlySelectedNode.data
            } : null} 
            handleNodeDataPropertyChange={updateNodeDataOnCanvas} 
          />
        </Panel>

      </ReactFlow>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-lg italic shadow-lg">N</div>
      </div>
    </div>
  );
};
