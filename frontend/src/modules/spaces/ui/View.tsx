"use client";

import React from 'react';
import { ReactFlow, Controls, Background, Panel, BackgroundVariant } from '@xyflow/react';

import { useCanvasLogic } from '../application/useCanvasLogic';

import { ZoneNode } from './nodes/ZoneNode';
import { AgentNode } from './nodes/AgentNode';
import { CrewNode } from './nodes/CrewNode';
import { PatternNode } from './nodes/PatternNode';
import { AutomationNode } from './nodes/AutomationNode';
import { TemplateNode } from './nodes/TemplateNode';
import { ServiceNode } from './nodes/ServiceNode';
import { EntityNode } from './nodes/EntityNode';
import CustomEdge from './edges/CustomEdge';

import { CanvasHeader } from './CanvasHeader';
import { LeftSidebar } from './LeftSidebar';
import { RightSidebar } from './RightSidebar';

import "@xyflow/react/dist/style.css";

const nodeTypes = {
  zone: ZoneNode,
  agent: AgentNode,
  crew: CrewNode,
  pattern: PatternNode,
  automation: AutomationNode,
  template: TemplateNode,
  service: ServiceNode,
  entity: EntityNode,
};

const edgeTypes = {
  'CustomEdge': CustomEdge,
};

export const CanvasView = ({ initialData }: { initialData?: unknown }) => {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    isValidConnection,
    onNodeClick,
    onPaneClick,
    onDragOver,
    onDrop,
    addNode,
    selectedNode,
    onNodeDataChange,
  } = useCanvasLogic(initialData);

  return (
    <div className="w-full h-full relative bg-black font-mono text-white selection:bg-purple-500/30">
      <CanvasHeader spaceName="Project Phoenix" projectName="Axon Redesign" projectId="axon-redesign" />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        attributionPosition="bottom-right"
        className="bg-black"
        minZoom={0.05}
        maxZoom={2}
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
          <LeftSidebar onAddComponent={addNode} />
        </Panel>

        <Panel position="top-right" className="m-0 z-50">
          <RightSidebar selectedNode={selectedNode} onNodeDataChange={onNodeDataChange} />
        </Panel>

      </ReactFlow>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-lg italic shadow-lg">N</div>
      </div>
    </div>
  );
};
