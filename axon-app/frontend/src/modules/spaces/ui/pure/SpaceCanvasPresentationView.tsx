import React from 'react';
import { ReactFlow, Controls, Background, Panel, BackgroundVariant, SelectionMode } from '@xyflow/react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, Info, Copy, Scissors, Trash2, Save, PlusCircle, Minimize2, X } from 'lucide-react';

import { SpaceZoneCanvasNode } from '../nodes/SpaceZoneCanvasNode';
import { SpaceAgentCanvasNode } from '../nodes/SpaceAgentCanvasNode';
import { SpaceCrewCanvasNode } from '../nodes/SpaceCrewCanvasNode';
import { SpacePatternCanvasNode } from '../nodes/SpacePatternCanvasNode';
import { SpaceAutomationCanvasNode } from '../nodes/SpaceAutomationCanvasNode';
import { SpaceTemplateCanvasNode } from '../nodes/SpaceTemplateCanvasNode';
import { SpaceServiceCanvasNode } from '../nodes/SpaceServiceCanvasNode';
import { SpaceEntityCanvasNode } from '../nodes/SpaceEntityCanvasNode';
import { SpaceCanvasCustomEdge } from '../edges/SpaceCanvasCustomEdge';

import { SpaceCanvasHeader } from '../SpaceCanvasHeader';
import { SpaceCanvasLeftSidebar } from '../SpaceCanvasLeftSidebar';
import { SpaceCanvasRightSidebar } from '../SpaceCanvasRightSidebar';
import { SpaceCreatePatternModal } from './SpaceCreatePatternModal';
import { MetaAgentOrb } from '../meta-agent/MetaAgentOrb';
import { MetaAgentPanel } from '../meta-agent/MetaAgentPanel';
import { cn } from "@/shared/lib/utils";
import { SpaceCanvasPresentationViewProperties } from '../types';

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

export type PureSpaceCanvasViewProperties = SpaceCanvasPresentationViewProperties & {
    readonly canvasViewProperties: any; // Result from useSpaceCanvasView
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
    runNode,
    currentlySelectedNode,
    handleKeyDown,
    canvasViewProperties,
    spaceData,
    isSaving,
    metaAgent
}: PureSpaceCanvasViewProperties): React.ReactNode => {
  const nodeComponents = React.useMemo(() => ({
    zone: SpaceZoneCanvasNode,
    agent: (props: any) => <SpaceAgentCanvasNode {...props} onRun={runNode} />,
    crew: (props: any) => <SpaceCrewCanvasNode {...props} onRun={runNode} />,
    pattern: SpacePatternCanvasNode,
    automation: SpaceAutomationCanvasNode,
    template: SpaceTemplateCanvasNode,
    service: SpaceServiceCanvasNode,
    entity: SpaceEntityCanvasNode,
  }), [runNode]);

  const {
    contextMenu,
    setContextMenu,
    analyzedBlueprint,
    setAnalyzedBlueprint,
    isSpacePressed,
    isFullscreen,
    setIsFullscreen,
    isFullscreenInspectorOpen,
    setIsFullscreenInspectorOpen,
    viewport,
    selectedNodes,
    isSuperPatternSelection,
    selectionScreenBounds,
    onNodeContextMenu,
    onPaneContextMenu,
    handleCanvasAction,
    handleSavePatternAction,
    targetNode,
    isWorking
  } = canvasViewProperties;

  const handleNodeClickInteraction = () => {
      if (isFullscreen) {
          setIsFullscreenInspectorOpen(true);
      }
  };

  const handlePaneClickInteraction = () => {
      setContextMenu(null);
      if (isFullscreen) {
          setIsFullscreenInspectorOpen(false);
      }
  };

  return (
    <div className="w-full h-full relative bg-black font-mono text-white selection:bg-purple-500" onClick={() => setContextMenu(null)}>
      <style>{CANVAS_STYLES}</style>

            <SpaceCanvasHeader
                spaceIdentifier={workspaceId}
                activeSpaceDisplayName={spaceData?.name || "Loading..."}
                parentProjectDisplayName={spaceData?.projectName || "Detached"}
                parentProjectIdentifier={spaceData?.projectId}
                isSaving={isSaving}
            />
      <ReactFlow
        nodes={canvasNodes}
        edges={canvasEdges}
        onNodesChange={handleCanvasNodesChange}
        onEdgesChange={handleCanvasEdgesChange}
        onConnect={handleNewConnectionCreated}
        isValidConnection={validateConnectionBetweenNodes as any}
        nodeTypes={nodeComponents}
        edgeTypes={canvasEdgeComponents}
        onDragOver={handleDragOverEvent}
        onDrop={handleDropEvent}
        onNodeClick={handleNodeClickInteraction}
        onNodeContextMenu={onNodeContextMenu}
        onPaneContextMenu={onPaneContextMenu}
        onSelectionContextMenu={(event) => {
            event.preventDefault();
            setContextMenu({ top: event.clientY, left: event.clientX, type: 'selection' });
        }}
        onKeyDown={handleKeyDown}
        onPaneClick={handlePaneClickInteraction}
        attributionPosition="bottom-right"
        className={cn(
            "bg-black",
            isSpacePressed && "is-space-panning",
            viewport.zoom < 0.4 && "canvas-lod-mid",
            viewport.zoom < 0.15 && "canvas-lod-low",
            viewport.zoom < 0.08 && "canvas-lod-very-low"
        )}
        minZoom={0.05}
        maxZoom={2}
        onlyRenderVisibleElements={true}
        nodeDragThreshold={5}
        selectNodesOnDrag={false}
        panOnScroll={true}
        selectionOnDrag={!isSpacePressed}
        panOnDrag={isSpacePressed ? [1, 2] : [2]}
        selectionMode={SelectionMode.Partial}
        selectionKeyCode="Shift"
        multiSelectionKeyCode="Shift"
        defaultEdgeOptions={{
            type: 'CustomEdge',
            style: { stroke: '#666', strokeWidth: 2 }
        }}
      >
        <Background color="#3f3f46" gap={24} size={2} variant={BackgroundVariant.Dots} />

        <AnimatePresence>
            {selectionScreenBounds && isSuperPatternSelection && (
                <>
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
                            className="w-full h-full bg-zinc-800 border-2 border-dashed border-zinc-500 rounded-[2.5rem]"
                        />
                    </Panel>

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
                                onClick={(event) => { event.stopPropagation(); handleCanvasAction('save-super-pattern'); }}
                                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest [0_0_30px_rgb(0,0,0)] hover:scale-105 active:scale-95 transition-all"
                            >
                                <PlusCircle size={14} />
                                Save as Super Pattern
                            </button>
                        </motion.div>
                    </Panel>
                </>
            )}
        </AnimatePresence>

        {!isFullscreen && (
          <Panel position="bottom-right" className="z-50 pointer-events-auto m-4">
            <Controls className="bg-zinc-900 border border-zinc-200 rounded-lg  p-1 fill-white stroke-white" />
          </Panel>
        )}

        {!isFullscreen && (
          <Panel position="top-left" className="m-0 z-50">
            <SpaceCanvasLeftSidebar onAddComponent={addNewNodeToCanvas} />
          </Panel>
        )}

        {!isFullscreen && (
          <Panel position="top-right" className="m-0 z-50">
            {selectedNodes.length === 1 && (
              <SpaceCanvasRightSidebar
                currentlySelectedNodeInformation={currentlySelectedNode ? {
                  id: currentlySelectedNode.id,
                  type: currentlySelectedNode.type || 'unknown',
                  data: currentlySelectedNode.data
                } : null}
                handleNodeDataPropertyChange={updateNodeDataOnCanvas}
                onRunNode={runNode}
                canvasNodes={canvasNodes}
              />

            )}
          </Panel>
        )}

        {isFullscreen && isFullscreenInspectorOpen && (
          <Panel position="top-right" className="m-0 z-50 pointer-events-auto">
            {selectedNodes.length === 1 && (
              <div className="relative group">
                <button 
                  onClick={(event) => { event.stopPropagation(); setIsFullscreenInspectorOpen(false); }}
                  className="absolute top-[104px] right-[24px] z-[60] p-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-all rounded-full text-white   group-hover:0"
                >
                  <X size={16} />
                </button>
                <SpaceCanvasRightSidebar
                  currentlySelectedNodeInformation={currentlySelectedNode ? {
                    id: currentlySelectedNode.id,
                    type: currentlySelectedNode.type || 'unknown',
                    data: currentlySelectedNode.data
                  } : null}
                  handleNodeDataPropertyChange={updateNodeDataOnCanvas}
                  onRunNode={runNode}
                  canvasNodes={canvasNodes}
                />

              </div>
            )}
          </Panel>
        )}

        <Panel position="top-right" className={cn("z-[1000] m-4", isFullscreen ? "fixed" : "hidden")}>
            <button 
                onClick={() => setIsFullscreen(false)}
                className="p-2 bg-zinc-900  border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors"
                title="Exit Fullscreen (Esc)"
            >
                <Minimize2 size={18} />
            </button>
        </Panel>

        <AnimatePresence>
            {contextMenu && (
                <Panel position="top-left" className="m-0 z-[1000] pointer-events-auto">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed bg-zinc-900  border border-zinc-800 rounded-xl  py-1.5 min-w-[180px] overflow-hidden"
                        style={{ top: contextMenu.top, left: contextMenu.left }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {contextMenu.type === 'node' && (
                            <>
                                <ContextMenuAction icon={<Play size={14} />} label="Run" onClick={() => handleCanvasAction('run')} disabled={isWorking} />
                                <ContextMenuAction icon={<Square size={14} />} label="Stop" onClick={() => handleCanvasAction('stop')} disabled={!isWorking} />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Info size={14} />} label="View Details" onClick={() => handleCanvasAction('details')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Duplicate" onClick={() => handleCanvasAction('duplicate')} />
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Scissors size={14} />} label="Cut" onClick={() => handleCanvasAction('cut')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Copy" onClick={() => handleCanvasAction('copy')} />
                                {targetNode?.type === 'zone' && (
                                    <>
                                        <div className="h-px bg-zinc-800 my-1" />
                                        <ContextMenuAction icon={<Save size={14} />} label="Save as Pattern" onClick={() => handleCanvasAction('save-pattern')} />
                                    </>
                                )}
                                <div className="h-px bg-zinc-800 my-1" />
                                <ContextMenuAction icon={<Trash2 size={14} className="text-red-500" />} label="Delete" onClick={() => handleCanvasAction('delete')} className="text-red-500 hover:bg-red-500" />
                            </>
                        )}
                        {contextMenu.type === 'selection' && (
                            <>
                                <ContextMenuAction icon={<Scissors size={14} />} label="Cut" onClick={() => handleCanvasAction('cut')} />
                                <ContextMenuAction icon={<Copy size={14} />} label="Copy" onClick={() => handleCanvasAction('copy')} />
                                <ContextMenuAction icon={<Trash2 size={14} className="text-red-500" />} label="Delete" onClick={() => handleCanvasAction('delete')} className="text-red-500 hover:bg-red-500" />
                                <div className="h-px bg-zinc-800 my-1" />
                                {isSuperPatternSelection ? (
                                    <ContextMenuAction icon={<Save size={14} />} label="Save as Super Pattern" onClick={() => handleCanvasAction('save-super-pattern')} />
                                ) : (
                                    <ContextMenuAction icon={<Save size={14} />} label="Save Selection as Pattern" onClick={() => handleCanvasAction('save-pattern')} />
                                )}
                            </>
                        )}
                        {contextMenu.type === 'pane' && (
                            <ContextMenuAction icon={<Copy size={14} />} label="Paste" onClick={() => handleCanvasAction('paste')} />
                        )}
                    </motion.div>
                </Panel>
            )}
        </AnimatePresence>

      </ReactFlow>

      <SpaceCreatePatternModal 
          isOpen={!!analyzedBlueprint}
          onClose={() => setAnalyzedBlueprint(null)}
          onSave={handleSavePatternAction}
          blueprint={analyzedBlueprint}
      />
      
      {!isFullscreen && (
        <div className="absolute bottom-6 left-6 z-50 flex items-center gap-2  grayscale hover:0 hover:grayscale-0 transition-all pointer-events-none">
            <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-white text-lg italic ">N</div>
        </div>
      )}

      {metaAgent && !isFullscreen && (
        <>
            <MetaAgentOrb 
                isOpen={metaAgent.isPanelOpen} 
                onClick={metaAgent.togglePanel} 
            />
            <MetaAgentPanel 
                isOpen={metaAgent.isPanelOpen}
                onClose={metaAgent.closePanel}
                drafts={metaAgent.drafts}
                connections={metaAgent.connections}
                reasoning={metaAgent.reasoning}
                isProposing={metaAgent.isProposing}
                error={metaAgent.error}
                onPropose={metaAgent.onPropose}
                onApproveDrafts={metaAgent.onApproveDrafts}
                onRejectDraft={metaAgent.onRejectDraft}
                onNewChat={metaAgent.onNewChat}
                contextStats={metaAgent.contextStats}
                contextLabel={metaAgent.contextLabel}
                knowledgeEnabled={metaAgent.knowledgeEnabled}
                setKnowledgeEnabled={metaAgent.setKnowledgeEnabled}
                attachedFiles={metaAgent.attachedFiles}
                addFiles={metaAgent.addFiles}
                removeFile={metaAgent.removeFile}
                query={metaAgent.query}
                setQuery={metaAgent.setQuery}
                isFocused={metaAgent.isFocused}
                setIsFocused={metaAgent.setIsFocused}
                isMaximized={metaAgent.isMaximized}
                setIsMaximized={metaAgent.setIsMaximized}
                isPaused={metaAgent.isPaused}
                setIsPaused={metaAgent.setIsPaused}
                hasProjectContext={metaAgent.hasProjectContext}
                hasNotionContext={metaAgent.hasNotionContext}
                systemAwarenessEnabled={metaAgent.systemAwarenessEnabled}
                activeStep={metaAgent.activeStep}
            />
        </>
      )}
    </div>
  );
};

const ContextMenuAction = ({ icon, label, onClick, disabled, className }: { icon: React.ReactNode; label: string; onClick: () => void; disabled?: boolean; className?: string }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
            "w-full px-3 py-2 flex items-center gap-3 text-[11px] font-bold uppercase tracking-wider transition-colors hover:bg-white disabled: disabled:pointer-events-none",
            className
        )}
    >
        <span className="text-zinc-400">{icon}</span>
        {label}
    </button>
);

const CANVAS_STYLES = `
    .canvas-lod-mid .node-body { display: none !important; }
    .canvas-lod-low .node-title, .canvas-lod-low .node-subtitle { display: none !important; }
    .canvas-lod-low .node-container { width: 60px !important; height: 60px !important; min-width: 0 !important; border-radius: 12px !important; border-width: 2px !important; padding: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
    .canvas-lod-low .node-header { padding: 0 !important; margin: 0 !important; display: flex !important; align-items: center !important; justify-content: center !important; }
    .canvas-lod-very-low .node-container { width: 24px !important; height: 24px !important; border-radius: 50% !important; border-width: 4px !important; }
    .canvas-lod-very-low .node-icon svg { width: 14px !important; height: 14px !important; }
    .canvas-lod-very-low .node-zone-label { display: block !important; }
    .canvas-lod-very-low .node-zone-label span { font-size: 6px !important; }
    
    /* Layer Isolation & VRAM optimization */
    .node-container { 
        contain: layout style paint; 
        content-visibility: auto;
        border-color: var(--zone-border-color, #52525b) !important; 
    }

    .node-zone-label > div { border-color: var(--zone-border-color, #52525b) !important; }
    .node-zone-label span { color: var(--zone-text-color, #a1a1aa) !important; }

    /* GPU Accelerated AI Working Animation */
    .ai-working-node { position: relative; overflow: hidden; transform: translateZ(0); }
    .ai-working-node::after {
        content: '';
        position: absolute;
        inset: -2px;
        border: 2px solid rgba(var(--ai-zone-color), 0.8);
        border-radius: inherit;
        pointer-events: none;
        animation: ai-glow-pulse-optimized 3s infinite ease-in-out;
        will-change: opacity;
        z-index: 1;
    }
    @keyframes ai-glow-pulse-optimized { 
        0%, 100% { opacity: 0.3; } 
        50% { opacity: 1; } 
    }

    .ai-shimmer-layer { position: absolute; inset: 0; pointer-events: none; z-index: 0; background-size: 200% 100%; animation: ai-shimmer-scan-safe 4s infinite linear; }
    @keyframes ai-shimmer-scan-safe { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
    
    .text-shimmer { background: linear-gradient(90deg, #71717a 0%, #ffffff 50%, #71717a 100%); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: text-shimmer-anim 3s linear infinite; }
    @keyframes text-shimmer-anim { 0% { background-position: 200% center; } 100% { background-position: 0% center; } }
    
    .node-container, .node-body, .node-title, .node-subtitle, .node-zone-label { transition: transform 0.2s ease-out, opacity 0.2s ease-out; }
`;
