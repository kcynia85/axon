"use client";

import React from "react";
import Image from "next/image";
import { Tabs, Tab, ScrollShadow } from "@heroui/react";
import { Zap, CheckCircle2, Layers, FileText, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { SpaceInspectorFooter } from "../../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../../inspectors/components/SpaceInspectorPanel";
import { useSpaceCrewHierarchicalInspector } from "../../../application/hooks/useSpaceCrewHierarchicalInspector";
import type { SpaceCrewInspectorProperties } from "../../types";

export const SpaceCrewHierarchicalNodeInspector = ({ 
    crewData, 
    nodeId,
    onPropertyChange,
    canvasNodes
}: SpaceCrewInspectorProperties) => {
    const { state, actions } = useSpaceCrewHierarchicalInspector(crewData, nodeId, onPropertyChange);

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Hierarchical Crew" 
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
                                    <div className="space-y-10">
                                        {/* MANAGER SECTION */}
                                        {state.manager_title && (
                                            <div className="space-y-3">
                                                <h5 className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.2em] pl-1">Orchestrator / Manager</h5>
                                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 shadow-xl flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full border-2 border-zinc-700 bg-black flex items-center justify-center overflow-hidden shadow-sm relative shrink-0">
                                                        {state.manager_visual_url ? (
                                                            <Image 
                                                                src={state.manager_visual_url} 
                                                                alt={state.manager_title}
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                            />
                                                        ) : (
                                                            <Users size={18} className="text-zinc-500" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="text-[16px] font-black uppercase text-white truncate">{state.manager_title}</div>
                                                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Control Protocol Active</div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                                                        <div className="w-1 h-1 rounded-full bg-green-500/50" />
                                                        <div className="w-1 h-1 rounded-full bg-green-500/20" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* WORKERS SECTION */}
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 gap-2">
                                                {state.tasks.map((task: any) => {
                                                    const isAgentWorking = task.status === 'working';
                                                    return (
                                                        <div 
                                                            key={task.id} 
                                                            className={cn(
                                                                "p-3 rounded-xl border transition-all flex items-start gap-3",
                                                                isAgentWorking 
                                                                    ? "bg-zinc-800/50 border-zinc-600 opacity-100 shadow-lg translate-x-1" 
                                                                    : "bg-zinc-900/20 border-zinc-800/50 opacity-60"
                                                            )}
                                                        >
                                                            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 bg-black flex items-center justify-center overflow-hidden shadow-sm relative shrink-0">
                                                                {task.visualUrl ? (
                                                                    <Image 
                                                                        src={task.visualUrl} 
                                                                        alt={task.assignedAgentTitle}
                                                                        fill
                                                                        sizes="32px"
                                                                        className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-zinc-500 text-[10px]">
                                                                        {task.assignedAgentTitle.charAt(0)}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start">
                                                                    <span className="text-[14px] font-black truncate text-zinc-200">{task.assignedAgentTitle}</span>
                                                                    {isAgentWorking && <Zap size={10} className="text-yellow-500 animate-pulse shrink-0" />}
                                                                </div>
                                                                {task.thought ? (
                                                                    <p className="text-[12px] font-mono text-zinc-400 mt-1  line-clamp-2">{task.thought}</p>
                                                                ) : (
                                                                    <p className="text-[12px] font-mono text-zinc-500 mt-1 ">Awaiting instructions...</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </SpaceCrewProgressBar>
                            </div>
                        </SpaceCrewOrchestrationLayout>
                    </div>
                </Tab>
                {/* Context and Artefacts tabs using shared components */}
                <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12}/> Context</div>}>
                    <SpaceCrewContextTab isContextComplete={state.isContextComplete} contextRequirements={state.contextRequirements} nodeSearchQuery={state.nodeSearch} onSearchQueryChange={actions.setNodeSearch} onContextLinkChange={actions.handleContextLinkChange} onLinkContextFromNode={actions.handleLinkContextFromNode} canvasNodes={canvasNodes} />
                </Tab>
                <Tab key="artefacts" title={<div className="flex items-center gap-2"><FileText size={12}/> Artefacts</div>}>
                    <SpaceCrewArtefactsTab isDone={state.isDone} artefacts={state.artefacts} progressValue={state.progressValue} isWorking={state.isWorking} editingArtefactId={state.editingArtefactId} setEditingArtefactId={actions.setEditingArtefactId} expandedVersionHistory={state.expandedVersionHistory} toggleVersionHistory={actions.toggleVersionHistory} handleRestoreVersion={actions.handleRestoreVersion} handleArtefactStatusChange={actions.handleArtefactStatusChange} handleArtefactOutputToggle={actions.handleArtefactOutputToggle} handleArtefactContentChange={actions.handleArtefactContentChange} />
                </Tab>
            </Tabs>
            <SpaceInspectorFooter>
                <button className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 shadow-xl" onClick={actions.submitConsultation}>Update State</button>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
