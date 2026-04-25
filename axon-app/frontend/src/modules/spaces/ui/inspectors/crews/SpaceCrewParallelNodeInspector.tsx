"use client";

import React from "react";
import Image from "next/image";
import { Tabs, Tab } from "@heroui/react";
import { Zap, CheckCircle2, Layers, FileText, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCognitionTab } from "../shared/SpaceCognitionTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { SpaceInspectorFooter } from "../../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../../inspectors/components/SpaceInspectorPanel";
import { useSpaceCrewParallelInspector } from "../../../application/hooks/useSpaceCrewParallelInspector";
import type { SpaceCrewInspectorProperties } from "../../types";

export const SpaceCrewParallelNodeInspector = ({ 
    crewData, 
    nodeId,
    onPropertyChange,
    onRunNode,
    canvasNodes
}: SpaceCrewInspectorProperties) => {
    const { state, actions } = useSpaceCrewParallelInspector(crewData, nodeId, onPropertyChange);

    const handleRun = async () => {
        if (!onRunNode) return;
        
        const contextSummary = state.contextRequirements.map((r: any) => {
            const value = r.link || r.sourceNodeLabel ? `${r.sourceNodeLabel}/${r.sourceArtifactLabel}` : "NOT_PROVIDED";
            return `${r.label}: ${value}`;
        }).join('\n');

        const finalInput = contextSummary.trim() || "Execute assigned team mission.";
        await onRunNode(nodeId, finalInput);
    };

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Parallel Crew" 
                size="sm" 
                variant="underlined"
                selectedKey={state.selectedTab}
                onSelectionChange={(key) => actions.setSelectedTab(key as string)}
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors p-0"
                }}
            >
                <Tab key="orchestration" title={<div className="flex items-center gap-2"><Zap size={12}/> Team {state.isDone && <CheckCircle2 size={10} className="text-white"/>}</div>}>
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewOrchestrationLayout>
                            <div className="flex flex-col space-y-10">
                                <SpaceCrewProgressBar progress={state.progressValue}>
                                    <div className="grid grid-cols-1 gap-3">
                                        {state.tasks.map((task: any) => {
                                            const isAgentWorking = task.status === 'working';
                                            return (
                                                <div 
                                                    key={task.id} 
                                                    className={cn(
                                                        "p-3 rounded-xl border transition-all flex items-start gap-3",
                                                        isAgentWorking 
                                                            ? "bg-blue-500 border-blue-500 0 " 
                                                            : "bg-zinc-900 border-zinc-800 "
                                                    )}
                                                    >
                                                    <div className="w-8 h-8 rounded-full border-2 border-zinc-700 bg-black flex items-center justify-center overflow-hidden  relative shrink-0">
                                                        {task.visualUrl ? (                                                            <Image 
                                                                src={task.visualUrl} 
                                                                alt={task.assignedAgentTitle}
                                                                fill
                                                                sizes="32px"
                                                                className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                            />
                                                        ) : (
                                                            <Users size={14} className="text-zinc-500" />
                                                        )}
                                                    </div>                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[14px] font-black truncate text-zinc-200">{task.assignedAgentTitle}</span>
                                                            <span className={cn(
                                                                "text-[8px] font-mono uppercase px-1.5 py-0.5 rounded",
                                                                isAgentWorking ? "bg-blue-500 text-white" : "bg-zinc-800 text-zinc-500"
                                                            )}>{task.status}</span>
                                                        </div>
                                                        <p className="text-[12px] font-mono text-zinc-500 mt-1 line-clamp-1">
                                                            {task.thought || "Concurrent task in progress..."}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </SpaceCrewProgressBar>

                                {(state.isDone || state.isAborted) && (
                                    <div className="space-y-4">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 py-4 border-b border-zinc-900"
                                        >
                                            {state.isDone ? <CheckCircle2 size={24} className="text-white" /> : <CircleStop size={24} className="text-zinc-500" />}
                                            <div>
                                                <h3 className="text-sm font-black text-white tracking-tight uppercase">{state.isDone ? "Wszystko gotowe!" : "Praca zatrzymana"}</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{state.isDone ? "Twój zespół przygotował materiały do przeglądu." : "Zakończyliśmy zadanie przed czasem."}</p>
                                            </div>
                                        </motion.div>

                                        {state.isDone && (
                                            <div className="pt-4">
                                                <button 
                                                    onClick={() => actions.setIsDetailsOpen(!state.isDetailsOpen)}
                                                    className="flex items-center justify-between w-full group py-1"
                                                >
                                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Squad Output:</h4>
                                                    {state.isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                                </button>
                                                
                                                <AnimatePresence mode="wait">
                                                    {state.isDetailsOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-4 mt-3 overflow-hidden"
                                                        >
                                                            <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                                                <p className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
                                                                    {crewData.final_output || "No output generated yet."}
                                                                </p>
                                                            </div>

                                                            {crewData.execution_trace && crewData.execution_trace.length > 0 && (
                                                                <div className="space-y-3">
                                                                    <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Collaborative Execution Trace:</h5>
                                                                    <div className="space-y-2">
                                                                        {crewData.execution_trace.map((step: any, idx: number) => (
                                                                            <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2">
                                                                                <div className="flex items-center justify-between gap-2">
                                                                                    <span className="text-[9px] font-black text-white px-2 py-0.5 bg-zinc-800 rounded uppercase truncate max-w-[100px]">{step.agent}</span>
                                                                                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-tighter shrink-0">{step.tool}</span>
                                                                                </div>
                                                                                <p className="text-[10px] text-zinc-400 italic">"{step.thought}"</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div className="pt-2 text-zinc-600 font-bold uppercase text-[9px]" suppressHydrationWarning>
                                                                Całkowity czas: {crewData.metrics?.duration || '2 min 15s'} | Zużycie: {crewData.metrics?.tokens?.toLocaleString() || '3,200'} tokenów
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SpaceCrewOrchestrationLayout>
                    </div>
                </Tab>
                <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12}/> Context</div>}>
                    <SpaceCrewContextTab isContextComplete={state.isContextComplete} contextRequirements={state.contextRequirements} nodeSearchQuery={state.nodeSearch} onSearchQueryChange={actions.setNodeSearch} onContextLinkChange={actions.handleContextLinkChange} onLinkContextFromNode={actions.handleLinkContextFromNode} canvasNodes={canvasNodes} />
                </Tab>
                <Tab key="artefacts" title={<div className="flex items-center gap-2"><FileText size={12}/> Artefacts</div>}>
                    <SpaceCrewArtefactsTab isDone={state.isDone} artefacts={state.artefacts} progressValue={state.progressValue} isWorking={state.isWorking} editingArtefactId={state.editingArtefactId} setEditingArtefactId={actions.setEditingArtefactId} expandedVersionHistory={state.expandedVersionHistory} toggleVersionHistory={actions.toggleVersionHistory} handleRestoreVersion={actions.handleRestoreVersion} handleArtefactStatusChange={actions.handleArtefactStatusChange} handleArtefactOutputToggle={actions.handleArtefactOutputToggle} handleArtefactContentChange={actions.handleArtefactContentChange} />
                </Tab>
            </Tabs>
            <SpaceInspectorFooter>
                <Button 
                    size="lg"
                    className="text-base font-bold bg-white text-black hover:bg-zinc-200 border-none transition-all active:scale-95 px-8" 
                    onPress={handleRun}
                    isDisabled={state.isWorking}
                >
                    {state.isWorking ? 'Uruchamianie...' : 'Rozpocznij pracę'}
                </Button>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
