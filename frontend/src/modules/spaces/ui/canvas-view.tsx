"use client";

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { AgentNode } from './node-types/agent-node';
import { SpaceCanvas } from '@/shared/domain/spaces';

const nodeTypes = {
  agent: AgentNode,
};

interface CanvasViewProps {
  initialData: SpaceCanvas;
}

export const CanvasView = ({ initialData }: CanvasViewProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialData.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialData.edges as Edge[]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const defaultViewport = useMemo(() => ({
    x: initialData.viewport.x,
    y: initialData.viewport.y,
    zoom: initialData.viewport.zoom,
  }), [initialData.viewport]);

  return (
    <div className="w-full h-full border rounded-lg bg-background overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultViewport={defaultViewport}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
        <Panel position="top-right" className="bg-background/80 p-2 border rounded shadow-sm">
            <p className="text-xs font-semibold">{initialData.name}</p>
        </Panel>
      </ReactFlow>
    </div>
  );
};
