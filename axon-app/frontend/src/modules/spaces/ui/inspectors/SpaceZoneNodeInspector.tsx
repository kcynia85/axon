"use client";

import React from "react";
import { Textarea, Tabs, Tab, ScrollShadow, Button } from "@heroui/react";
import { Layers, Box, ExternalLink, CheckCircle, Target, CheckCircle2, Clock, X, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorPanel } from "./components/SpaceInspectorPanel";
import { useSpaceZoneInspector } from "../../application/hooks/useSpaceZoneInspector";
import type { SpaceZoneInspectorProperties } from "../types";

export const SpaceZoneNodeInspector = ({ 
    zoneData, 
    nodeId,
    onPropertyChange,
    canvasNodes = [],
    onClose
}: SpaceZoneInspectorProperties) => {
    const { state, actions } = useSpaceZoneInspector(zoneData, nodeId, onPropertyChange, canvasNodes);

    return (
        <SpaceInspectorPanel className="relative">
            {onClose && (
                <div className="absolute top-2 right-6 z-30">
                    <Button 
                        isIconOnly 
                        variant="light" 
                        size="sm" 
                        className="text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        onPress={onClose}
                    >
                        <X size={20} strokeWidth={3} />
                    </Button>
                </div>
            )}


            <Tabs 
                aria-label="Zone Inspector Tabs" 
                size="sm" 
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-8 w-full gap-8",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors p-0"
                }}
            >
                <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12}/> Context</div>}>
                    <div className="p-8 space-y-8">
                        <div className="space-y-4">
                            <label htmlFor="requiredContext" className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em]">Zone Context Requirement</label>
                            <Textarea
                                id="requiredContext"
                                variant="bordered"
                                placeholder="Describe the high-level context required for this zone to operate..."
                                value={state.requiredContext}
                                onChange={(event) => actions.onPropertyChange(event.target.value)}
                                minRows={6}
                                classNames={{
                                    input: "text-xs font-mono text-zinc-300",
                                    inputWrapper: "bg-black border-zinc-700 focus-within:!border-zinc-200 rounded-xl"
                                }}
                            />
                        </div>
                        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl">
                            <p className="text-[10px] text-zinc-500 font-bold leading-relaxed italic">
                                This context is shared with all agents and automations residing within this zone.
                            </p>
                        </div>
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <Box size={12}/> 
                            Artefacts
                            {state.hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [0_0_8px_rgb(0,0,0)]" />
                            ) : state.childArtefacts.length > 0 ? (
                                <CheckCircle2 size={10} className="text-green-500" />
                            ) : null}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-192px)] p-8">
                        <div className="space-y-6">
                            {state.childArtefacts.map((entry, index) => (
                                <div 
                                    key={`${entry.artefact.id}-${index}`} 
                                    onClick={() => actions.handleNavigateToNode(entry.nodeId)}
                                    className="group p-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-400 hover:bg-zinc-900 rounded-2xl transition-all cursor-pointer relative overflow-hidden"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 [0_0_10px_rgb(0,0,0)]" />
                                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-tighter">{entry.nodeLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Target size={10} className="text-zinc-600  group-hover:0 transition-opacity" />
                                            {entry.artefact.link && <ExternalLink size={10} className="text-zinc-600 group-hover:text-zinc-200 transition-colors" />}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold text-zinc-200">{entry.artefact.label}</p>
                                        <div className={cn("flex items-center gap-1", entry.artefact.status === 'approved' ? "text-green-500" : "text-blue-400")}>
                                            {entry.artefact.status === 'approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                            <span className="text-[8px] font-black uppercase">{entry.artefact.status === 'approved' ? 'Approved' : 'In Review'}</span>
                                        </div>
                                    </div>
                                    <div className="absolute inset-y-0 right-0 w-1 bg-zinc-400 translate-x-full group-hover:translate-x-0 transition-transform" />
                                </div>
                            ))}
                            {state.childArtefacts.length === 0 && (
                                <div className="py-16 flex flex-col items-center justify-center border-2 border-dashed border-zinc-900 rounded-[2.5rem] ">
                                    <Box size={32} className="text-zinc-700 mb-4" />
                                    <p className="text-[10px] font-black uppercase text-zinc-600 tracking-widest text-center px-8">No active outputs detected in this zone yet</p>
                                </div>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </SpaceInspectorPanel>
    );
};
