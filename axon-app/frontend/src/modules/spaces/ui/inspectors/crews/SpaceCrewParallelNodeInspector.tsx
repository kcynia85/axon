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
    canvasNodes
}: SpaceCrewInspectorProperties) => {
    const { state, actions } = useSpaceCrewParallelInspector(crewData, nodeId, onPropertyChange);

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
                                                            ? "bg-blue-500/5 border-blue-500/20 opacity-100 shadow-lg" 
                                                            : "bg-zinc-900/20 border-zinc-800/50 opacity-60"
                                                    )}
                                                    >
                                                    <div className="w-8 h-8 rounded-full border-2 border-zinc-700 bg-black flex items-center justify-center overflow-hidden shadow-sm relative shrink-0">
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
                <button className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 shadow-xl" onClick={actions.submitConsultation}>Update Parallel States</button>
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
