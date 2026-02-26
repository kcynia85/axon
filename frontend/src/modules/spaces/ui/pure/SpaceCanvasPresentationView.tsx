// frontend/src/modules/spaces/ui/pure/SpaceCanvasPresentationView.tsx

import React, { useState, useCallback } from 'react';
import { ReactFlow, Controls, Background, Panel, BackgroundVariant, useReactFlow } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Info, Copy, Scissors, Trash2, Save } from 'lucide-react';

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
import { cn } from "@/shared/lib/utils";

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
    readonly duplicateNode: (node: Node) => void;
    readonly deleteNodes: (nodeIds: string[]) => void;
    readonly updateNodesStatus: (nodeIds: string[], status: string) => void;
    readonly copyNodes: (nodes: Node[]) => void;
    readonly cutNodes: (nodes: Node[]) => void;
    readonly pasteNodes: (position?: { x: number; y: number }) => void;
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
    duplicateNode,
    deleteNodes,
    updateNodesStatus,
    copyNodes,
    cutNodes,
    pasteNodes,
}: SpaceCanvasPresentationViewProperties) => {
  const [menu, setMenu] = useState<{ id?: string; top: number; left: number; type: 'node' | 'pane' | 'selection' } | null>(null);
  const { screenToFlowPosition, getNodes } = useReactFlow();

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      
      const selectedNodes = getNodes().filter(n => n.selected);
      if (selectedNodes.length > 1 && selectedNodes.some(n => n.id === node.id)) {
          setMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
      } else {
          setMenu({ id: node.id, top: event.clientY, left: event.clientX, type: 'node' });
      }
    },
    [getNodes]
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      setMenu({ top: event.clientY, left: event.clientX, type: 'pane' });
    },
    []
  );

  const onPaneClick = useCallback(() => setMenu(null), []);

  const handleAction = useCallback((action: string) => {
      const selectedNodes = getNodes().filter(n => n.selected);
      const targetNode = menu?.id ? getNodes().find(n => n.id === menu.id) : null;
      
      switch (action) {
          case 'run':
              if (targetNode) updateNodesStatus([targetNode.id], targetNode.type === 'service' ? 'in_progress' : 'working');
              break;
          case 'stop':
              if (targetNode) updateNodesStatus([targetNode.id], targetNode.type === 'service' ? 'idle' : 'done');
              break;
          case 'duplicate':
              if (targetNode) duplicateNode(targetNode);
              break;
          case 'delete':
              if (menu?.type === 'selection') {
                  deleteNodes(selectedNodes.map(n => n.id));
              } else if (targetNode) {
                  deleteNodes([targetNode.id]);
              }
              break;
          case 'copy':
              if (menu?.type === 'selection') {
                  copyNodes(selectedNodes);
              } else if (targetNode) {
                  copyNodes([targetNode]);
              }
              break;
          case 'cut':
              if (menu?.type === 'selection') {
                  cutNodes(selectedNodes);
              } else if (targetNode) {
                  cutNodes([targetNode]);
              }
              break;
          case 'paste':
              if (menu) {
                  const flowPos = screenToFlowPosition({ x: menu.left, y: menu.top });
                  pasteNodes(flowPos);
              }
              break;
          case 'details':
              if (targetNode) {
                  // In this architecture, selection triggers the sidebar
                  handleCanvasNodesChange([{ id: targetNode.id, type: 'select', selected: true }]);
              }
              break;
          case 'save-pattern':
              console.log('Save selection as pattern', selectedNodes);
              // Modal implementation would go here
              break;
      }
      setMenu(null);
  }, [menu, getNodes, updateNodesStatus, duplicateNode, deleteNodes, copyNodes, cutNodes, pasteNodes, screenToFlowPosition, handleCanvasNodesChange]);

  const targetNode = menu?.id ? getNodes().find(n => n.id === menu.id) : null;
  const isWorking = targetNode ? (targetNode.type === 'service' ? targetNode.data.status === 'in_progress' : targetNode.data.state === 'working') : false;

  return (
    <div className="w-full h-full relative bg-black font-mono text-white selection:bg-purple-500/30" onClick={onPaneClick}>
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
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
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

        <AnimatePresence>
            {menu && (
                <Panel position="top-left" className="m-0 z-[1000] pointer-events-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-xl shadow-2xl py-1.5 min-w-[180px] overflow-hidden"
                        style={{ top: menu.top, left: menu.left }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {menu.type === 'node' && (
                            <>
                                <ContextMenuAction icon={<Play size={14} />} label="Run" onClick={() => handleAction('run')} disabled={isWorking} />
                                <ContextMenuAction icon={<Square size={14} />} label="Stop" onClick={() => handleAction('stop')} disabled={!isWorking} />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Info size={14} />} label="View Details" onClick={() => handleAction('details')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Duplicate" onClick={() => handleAction('duplicate')} />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Scissors size={14} />} label="Cut" onClick={() => handleAction('cut')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Copy" onClick={() => handleAction('copy')} />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Trash2 size={14} className="text-red-500" />} label="Delete" onClick={() => handleAction('delete')} className="text-red-500 hover:bg-red-500/10" />
                            </>
                        )}
                        {menu.type === 'selection' && (
                            <>
                                <ContextMenuAction icon={<Scissors size={14} />} label="Cut" onClick={() => handleAction('cut')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Copy" onClick={() => handleAction('copy')} />
                                <ContextMenuAction icon={<Trash2 size={14} className="text-red-500" />} label="Delete" onClick={() => handleAction('delete')} className="text-red-500 hover:bg-red-500/10" />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Save size={14} />} label="Save Selection as Pattern" onClick={() => handleAction('save-pattern')} />
                            </>
                        )}
                        {menu.type === 'pane' && (
                            <ContextMenuAction icon={<Copy size={14} />} label="Paste" onClick={() => handleAction('paste')} />
                        )}
                    </motion.div>
                </Panel>
            )}
        </AnimatePresence>

      </ReactFlow>
      
      {/* Footer Branding */}
      <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-lg italic shadow-lg">N</div>
      </div>
    </div>
  );
};

const ContextMenuAction = ({ icon, label, onClick, disabled, className }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; className?: string }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "w-full px-3 py-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-white/5 disabled:opacity-30 disabled:pointer-events-none",
            className
        )}
    >
        <span className="text-zinc-400">{icon}</span>
        {label}
    </button>
);
