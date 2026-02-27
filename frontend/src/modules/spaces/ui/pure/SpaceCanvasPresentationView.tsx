// frontend/src/modules/spaces/ui/pure/SpaceCanvasPresentationView.tsx

import React, { useState, useCallback, useMemo } from 'react';
import { ReactFlow, Controls, Background, Panel, BackgroundVariant, useReactFlow, SelectionMode, useViewport } from '@xyflow/react';
import type { Node, Edge, OnNodesChange, OnEdgesChange, Connection } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Info, Copy, Scissors, Trash2, Save, PlusCircle } from 'lucide-react';

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
import { SpaceCreatePatternModal } from './SpaceCreatePatternModal';
import { cn } from "@/shared/lib/utils";
import { SpacePatternBlueprint } from '../../domain/types';
import { useCreatePattern } from '@/modules/workspaces/application/usePatterns';

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
    readonly workspaceId: string;
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
    readonly createPatternFromSelection: (name: string, description: string, type?: 'pattern' | 'super-pattern') => SpacePatternBlueprint;
    readonly instantiatePatternFromBlueprint: (blueprint: SpacePatternBlueprint, position: { x: number; y: number }) => void;
    readonly handleKeyDown: (event: React.KeyboardEvent) => void;
};

export const SpaceCanvasPresentationView = ({
    workspaceId,
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
}: SpaceCanvasPresentationViewProperties) => {
  const [menu, setMenu] = useState<{ id?: string; top: number; left: number; type: 'node' | 'pane' | 'selection' } | null>(null);
  const [analyzedBlueprint, setAnalyzedBlueprint] = useState<SpacePatternBlueprint | null>(null);
  const { screenToFlowPosition, flowToScreenPosition, getNodes } = useReactFlow();
  const { x: vpX, y: vpY, zoom: vpZoom } = useViewport();

  const { mutateAsync: createPattern } = useCreatePattern(workspaceId);

  const selectedNodes = useMemo(() => canvasNodes.filter(n => n.selected), [canvasNodes]);
  const zonesInSelection = useMemo(() => selectedNodes.filter(n => n.type === 'zone'), [selectedNodes]);
  const isSuperPatternSelection = zonesInSelection.length > 1;

  const selectionScreenBounds = useMemo(() => {
      if (selectedNodes.length === 0) return null;
      
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      selectedNodes.forEach(node => {
          // Get absolute canvas position
          let absX = node.position.x;
          let absY = node.position.y;
          
          let parentId = node.parentId;
          while (parentId) {
              const parent = canvasNodes.find(n => n.id === parentId);
              if (parent) {
                  absX += parent.position.x;
                  absY += parent.position.y;
                  parentId = parent.parentId;
              } else {
                  break;
              }
          }

          const w = node.measured?.width || (node.type === 'zone' ? 400 : 200);
          const h = node.measured?.height || (node.type === 'zone' ? 300 : 100);
          
          if (absX < minX) minX = absX;
          if (absY < minY) minY = absY;
          if (absX + w > maxX) maxX = absX + w;
          if (absY + h > maxY) maxY = absY + h;
      });

      if (minX === Infinity) return null;

      // Add larger padding to the selection area
      const PADDING = 40;
      const minXPadded = minX - PADDING;
      const minYPadded = minY - PADDING;
      const maxXPadded = maxX + PADDING;
      const maxYPadded = maxY + PADDING;

      // Convert absolute canvas bounds to screen coordinates
      const topLeft = flowToScreenPosition({ x: minXPadded, y: minYPadded });
      const bottomRight = flowToScreenPosition({ x: maxXPadded, y: maxYPadded });

      return {
          x: topLeft.x,
          y: topLeft.y,
          width: bottomRight.x - topLeft.x,
          height: bottomRight.y - topLeft.y
      };
  }, [selectedNodes, canvasNodes, flowToScreenPosition, vpX, vpY, vpZoom]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      const currentSelectedNodes = getNodes().filter(n => n.selected);
      if (currentSelectedNodes.length > 1 && currentSelectedNodes.some(n => n.id === node.id)) {
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
      const currentSelectedNodes = getNodes().filter(n => n.selected);
      if (currentSelectedNodes.length > 1) {
          setMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
      } else {
          setMenu({ top: event.clientY, left: event.clientX, type: 'pane' });
      }
    },
    [getNodes]
  );

  const onSelectionContextMenu = useCallback(
    (event: React.MouseEvent, _nodes: Node[]) => {
      event.preventDefault();
      setMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
    },
    []
  );

  const onPaneClick = useCallback(() => setMenu(null), []);

  const handleAction = useCallback((action: string) => {
      const targetNode = menu?.id ? getNodes().find(n => n.id === menu.id) : null;
      const currentSelectedNodes = getNodes().filter(n => n.selected);
      
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
                  deleteNodes(currentSelectedNodes.map(n => n.id));
              } else if (targetNode) {
                  deleteNodes([targetNode.id]);
              }
              break;
          case 'copy':
              if (menu?.type === 'selection') {
                  copyNodes(currentSelectedNodes);
              } else if (targetNode) {
                  copyNodes([targetNode]);
              }
              break;
          case 'cut':
              if (menu?.type === 'selection') {
                  cutNodes(currentSelectedNodes);
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
                  handleCanvasNodesChange([{ id: targetNode.id, type: 'select', selected: true }]);
              }
              break;
          case 'save-pattern': {
              const blueprint = createPatternFromSelection("New Pattern", "", 'pattern');
              setAnalyzedBlueprint(blueprint);
              break;
          }
          case 'save-super-pattern': {
              const blueprint = createPatternFromSelection("New Super Pattern", "", 'super-pattern');
              setAnalyzedBlueprint(blueprint);
              break;
          }
      }
      setMenu(null);
  }, [menu, getNodes, updateNodesStatus, duplicateNode, deleteNodes, copyNodes, cutNodes, pasteNodes, screenToFlowPosition, handleCanvasNodesChange, createPatternFromSelection]);

  const handleSavePattern = async (name: string, description: string) => {
      if (!analyzedBlueprint) return;
      
      try {
          const finalBlueprint = { ...analyzedBlueprint, name, description };
          
          await createPattern({
              pattern_name: finalBlueprint.name,
              pattern_type: finalBlueprint.type === 'super-pattern' ? "Pattern" : "Pattern", // Mapping to enum
              pattern_okr_context: finalBlueprint.description,
              pattern_graph_structure: {
                  ...finalBlueprint.structure,
                  interface: finalBlueprint.interface,
                  dependencies: finalBlueprint.dependencies,
                  blueprint_type: finalBlueprint.type
              },
              pattern_keywords: [finalBlueprint.type, "Intelligent Mapping"],
              availability_workspace: [workspaceId]
          });

          console.log('Intelligent Pattern Detected & Saved Successfully');
          setAnalyzedBlueprint(null);
      } catch (error) {
          console.error('Failed to save pattern:', error);
      }
  };

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
        onSelectionContextMenu={onSelectionContextMenu}
        onKeyDown={handleKeyDown}
        fitView
        attributionPosition="bottom-right"
        className="bg-black !cursor-crosshair"
        minZoom={0.05}
        maxZoom={2}
        onlyRenderVisibleElements={true}
        nodeDragThreshold={5}
        selectNodesOnDrag={false}
        panOnScroll={true}
        selectionOnDrag={true}
        panOnDrag={[1, 2]}
        selectionMode={SelectionMode.Partial}
        selectionKeyCode={null}
        defaultEdgeOptions={{
            type: 'CustomEdge',
            style: { stroke: '#666', strokeWidth: 2 }
        }}
      >
        <Background color="#1a1a1a" gap={20} size={1} variant={BackgroundVariant.Dots} />

        {/* Floating Selection Backdrop & FAB */}
        <AnimatePresence>
            {selectionScreenBounds && isSuperPatternSelection && (
                <>
                    {/* Gray Selection Backdrop - only for super pattern selection */}
                    <Panel position="top-left" style={{ 
                        transform: `translate(${selectionScreenBounds.x}px, ${selectionScreenBounds.y}px)`,
                        width: selectionScreenBounds.width,
                        height: selectionScreenBounds.height,
                        position: 'absolute',
                        margin: 0
                    }} className="z-[900] pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="w-full h-full bg-zinc-800/20 border-2 border-dashed border-zinc-500/30 rounded-[2.5rem]"
                        />
                    </Panel>

                    {/* FAB at top-right of the selection area */}
                    <Panel position="top-left" style={{ 
                        transform: `translate(${selectionScreenBounds.x + selectionScreenBounds.width + 16}px, ${selectionScreenBounds.y}px)`,
                        position: 'absolute',
                        margin: 0
                    }} className="z-[1000] pointer-events-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); handleAction('save-super-pattern'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all"
                            >
                                <PlusCircle size={14} />
                                Add as Super Pattern
                            </button>
                        </motion.div>
                    </Panel>
                </>
            )}
        </AnimatePresence>

        <Panel position="bottom-right" className="z-50 pointer-events-auto m-4">
          <Controls className="bg-zinc-900 border border-zinc-200 rounded-lg shadow-2xl p-1 fill-white stroke-white" />
        </Panel>

        <Panel position="top-left" className="m-0 z-50">
          <SpaceCanvasLeftSidebar onAddComponent={addNewNodeToCanvas} />
        </Panel>

        <Panel position="top-right" className="m-0 z-50">
          {selectedNodes.length === 1 && (
            <SpaceCanvasRightSidebar 
              currentlySelectedNodeInformation={currentlySelectedNode ? {
                id: currentlySelectedNode.id,
                type: currentlySelectedNode.type || 'unknown',
                data: currentlySelectedNode.data
              } : null} 
              handleNodeDataPropertyChange={updateNodeDataOnCanvas} 
              canvasNodes={canvasNodes}
            />
          )}
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
                                {targetNode?.type === 'zone' && (
                                    <>
                                        <div className="h-px bg-zinc-800 my-1" />
                                        <ContextMenuAction icon={<Save size={14} />} label="Save as Pattern" onClick={() => handleAction('save-pattern')} />
                                    </>
                                )}
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
                                {isSuperPatternSelection ? (
                                    <ContextMenuAction icon={<Save size={14} />} label="Save as Super Pattern" onClick={() => handleAction('save-super-pattern')} />
                                ) : (
                                    <ContextMenuAction icon={<Save size={14} />} label="Save Selection as Pattern" onClick={() => handleAction('save-pattern')} />
                                )}
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

      <SpaceCreatePatternModal 
          isOpen={!!analyzedBlueprint}
          onClose={() => setAnalyzedBlueprint(null)}
          onSave={handleSavePattern}
          blueprint={analyzedBlueprint}
      />
      
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
