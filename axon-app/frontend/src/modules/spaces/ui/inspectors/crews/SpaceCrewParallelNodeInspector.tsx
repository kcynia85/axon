"use client";

import React from "react";
import { Tabs, Tab, Avatar } from "@heroui/react";
import { Zap, CheckCircle2, Layers, FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { SpaceInspectorFooter } from "../../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../../inspectors/components/SpaceInspectorPanel";
import { useSpaceCrewParallelInspector } from "../../../application/hooks/useSpaceCrewParallelInspector";
import type { SpaceCrewInspectorProperties } from "../../types";

export const SpaceCrewParallelNodeInspector = ({ 
    data, 
    nodeId,
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const { state, actions } = useSpaceCrewParallelInspector(data, nodeId, onPropertyChange);

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
                                    <div className="space-y-8">
                                        {state.tasks.map((task: any, i: number) => (
                                            <div key={task.id} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Avatar name={task.assignedAgentTitle} size="sm" className="w-6 h-6 bg-zinc-800" />
                                                    <span className="text-[11px] font-black uppercase">{task.assignedAgentTitle}</span>
                                                </div>
                                                <span className="text-[8px] font-black uppercase text-zinc-500">{task.status}</span>
                                            </div>
                                        ))}
                                    </div>
                                </SpaceCrewProgressBar>
                            </div>
                        </SpaceCrewOrchestrationLayout>
                    </div>
                </Tab>
                <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12}/> Context</div>}>
                    <SpaceCrewContextTab isContextComplete={state.isContextComplete} contextRequirements={state.contextRequirements} nodeSearch={state.nodeSearch} setNodeSearch={actions.setNodeSearch} handleContextLinkChange={actions.handleContextLinkChange} handleLinkContextFromNode={actions.handleLinkContextFromNode} />
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
