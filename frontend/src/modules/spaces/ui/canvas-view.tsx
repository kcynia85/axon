"use client";

import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
  Panel,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from "next-themes";

import { ZoneNode } from './nodes/zone-node';
import { AgentNode } from './nodes/agent-node';
import { CrewNode } from './nodes/crew-node';
import { PatternNode } from './nodes/pattern-node';
import { AutomationNode } from './nodes/automation-node';
import { TemplateNode } from './nodes/template-node';
import { ServiceNode } from './nodes/service-node';

import { CanvasHeader } from './canvas-header';
import { LeftSidebar } from './left-sidebar';
import { RightSidebar } from './right-sidebar';

const nodeTypes = {
  zone: ZoneNode,
  agent: AgentNode,
  crew: CrewNode,
  pattern: PatternNode,
  automation: AutomationNode,
  template: TemplateNode,
  service: ServiceNode,
};

interface CanvasViewProps {
    initialData?: any; 
}

const initialNodes: Node[] = [
  { 
    id: 'zone-1', 
    type: 'zone', 
    position: { x: 100, y: 100 }, 
    data: { 
        label: 'Discovery', 
        type: 'discovery',
        color: 'purple' 
    },
    style: { width: 1000, height: 800 },
  },
  
  // AGENT EXAMPLES - Assigned to Discovery (Purple)
  { 
    id: 'agent-working', 
    type: 'agent', 
    position: { x: 50, y: 50 }, 
    parentId: 'zone-1',
    extent: 'parent',
    data: { 
        label: 'Copywriter', 
        state: 'working',
        progress: 45,
        zoneColor: 'purple'
    },
  },

  // AUTOMATION EXAMPLE - Assigned to Discovery (Purple)
  { 
    id: 'auto-1', 
    type: 'automation', 
    position: { x: 400, y: 50 }, 
    parentId: 'zone-1',
    extent: 'parent',
    data: { 
        label: 'Invoice Scanner', 
        state: 'completed',
        artifactName: 'invoice_data.json',
        zoneColor: 'purple'
    },
  },

  // SERVICE EXAMPLE - Assigned to Discovery (Purple)
  { 
    id: 'service-1', 
    type: 'service', 
    position: { x: 50, y: 400 }, 
    parentId: 'zone-1',
    extent: 'parent',
    data: { 
        label: 'ElevenLabs', 
        actionName: 'Generate Intro Voiceover',
        status: 'in_progress',
        zoneColor: 'purple'
    },
  },

  // TEMPLATE EXAMPLE - Assigned to Discovery (Purple)
  { 
    id: 'template-1', 
    type: 'template', 
    position: { x: 400, y: 400 }, 
    parentId: 'zone-1',
    extent: 'parent',
    data: { 
        label: 'Analiza Konkurencji', 
        status: 'in_progress',
        completedActions: 1,
        totalActions: 6,
        zoneColor: 'purple'
    },
  },
];

const initialEdges: any[] = [];

export const CanvasView = ({ initialData }: CanvasViewProps) => {
  const { theme } = useTheme();
  // @ts-ignore
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  // @ts-ignore
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [selectedNodeId, setSelectedNodeId] = React.useState<string | null>(null);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  
  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
      setSelectedNodeId(null);
  }, []);

  const selectedNode = useMemo(() => {
      return nodes.find((n) => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      const dataString = event.dataTransfer.getData('application/axon-data');

      if (typeof type === 'undefined' || !type || !dataString) {
        return;
      }
      
      const data = JSON.parse(dataString);
      
      const position = {
        x: event.clientX - 300, 
        y: event.clientY - 100,
      };
      
      const newNode: Node = {
        id: `dndnode_${Math.random()}`,
        type,
        position,
        data: {
            ...data,
            state: 'missing_context' 
        },
        style: type === 'zone' ? { width: 500, height: 400 } : undefined,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );


  return (
    <div className="w-full h-full relative bg-[#f9f9f9] dark:bg-[#0a0a0a] font-mono [&_*]:font-mono">
      <CanvasHeader spaceName="Project Phoenix" projectName="Axon Redesign" />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        fitView
        attributionPosition="bottom-right"
        className="bg-transparent"
        minZoom={0.1}
      >
        <Background 
            color={theme === 'dark' ? '#333' : '#ccc'} 
            gap={20} 
            size={1} 
            variant={BackgroundVariant.Dots} 
        />
        <Controls className="!bg-background/80 !backdrop-blur-md !border-default-200 !shadow-sm !fill-foreground [&>button]:!border-default-100 m-4 rounded-xl overflow-hidden" />
        
        <Panel position="top-left" className="m-0 z-50 pointer-events-none h-full">
            <LeftSidebar />
        </Panel>
        
        <Panel position="top-right" className="m-0 z-50 pointer-events-none h-full">
             <RightSidebar selectedNode={selectedNode} />
        </Panel>

      </ReactFlow>
    </div>
  );
};
