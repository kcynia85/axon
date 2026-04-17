"use client";

import React from "react";
import Image from "next/image";
import { Tabs, Tab, Input, Button } from "@heroui/react";
import { Zap, CheckCircle2, Layers, FileText, CircleStop, Terminal, ChevronUp, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { SpaceInspectorFooter } from "../../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../../inspectors/components/SpaceInspectorPanel";
import { useSpaceCrewSequentialInspector } from "../../../application/hooks/useSpaceCrewSequentialInspector";
import type { SpaceCrewInspectorProperties } from "../../types";

/**
 * SpaceCrewSequentialNodeInspector - Pure view component for sequential crew details.
 * Delegates logic to useSpaceCrewSequentialInspector hook.
 */
export const SpaceCrewSequentialNodeInspector = ({ 
    crewData, 
    nodeId,
    onPropertyChange,
    canvasNodes
}: SpaceCrewInspectorProperties) => {
    const { state, actions } = useSpaceCrewSequentialInspector(crewData, nodeId, onPropertyChange);

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Sequential Crew" 
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
                <Tab 
                    key="orchestration" 
                    title={
                        <div className="flex items-center gap-2">
                            <Zap size={12}/> 
                            Team 
                            {state.isDone && <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewOrchestrationLayout>
                            <div className="flex flex-col space-y-10">
                                {(state.isMissingContext || state.isBriefing) && (
                                    <div className="space-y-4">
                                        {state.tasks.map((task: any, i: number) => {
                                            const isFilled = task.label.trim().length > 0;
                                            return (
                                                <motion.div 
                                                    key={task.id} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-4 rounded-xl space-y-1 transition-all border border-zinc-800 bg-zinc-900/30"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
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
                                                                    <Users size={14} className="text-zinc-500" />
                                                                )}
                                                            </div>
                                                            <span className="text-[14px] font-black text-zinc-200">{task.assignedAgentTitle}</span>
                                                        </div>
                                                    </div>
                                                    <Input 
                                                        size="sm" 
                                                        variant="underlined" 
                                                        value={task.label} 
                                                        onValueChange={(val) => actions.handleTaskLabelChange(task.id, val)} 
                                                        endContent={isFilled && <CheckCircle2 size={12} className="text-zinc-400" />}
                                                        classNames={{ 
                                                            input: "!text-zinc-400 text-[14px] font-normal", 
                                                            inputWrapper: cn(
                                                                "h-10 border-b-2 transition-all px-0",
                                                                isFilled ? "border-white" : "border-zinc-800/50"
                                                            )
                                                        }} 
                                                    />
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                )}

                                {(state.isWorking || state.isConsultation) && (
                                    <div className="space-y-8">
                                        {state.isConsultation && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="space-y-5 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl"
                                            >
                                                {state.consultationQuestions.map((question: any) => {
                                                    const isAnswered = (state.consultationAnswers[question.id] || question.answer || "").trim().length > 0;
                                                    return (
                                                        <div key={question.id} className="space-y-2.5">
                                                            <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">{question.question}</p>
                                                            <Input 
                                                                placeholder="Type your answer..." 
                                                                size="sm" 
                                                                variant="bordered" 
                                                                value={state.consultationAnswers[question.id] || question.answer || ""} 
                                                                onValueChange={(val) => actions.handleAnswerChange(question.id, val)} 
                                                                endContent={isAnswered && <CheckCircle2 size={14} className="text-white" />}
                                                                classNames={{ 
                                                                    input: "text-xs font-mono text-zinc-300", 
                                                                    inputWrapper: cn(
                                                                        "h-11 bg-black rounded-lg transition-all shadow-none border",
                                                                        isAnswered ? "border-white border-2" : "border-zinc-800 hover:border-zinc-700"
                                                                    )
                                                                }} 
                                                            />
                                                        </div>
                                                    );
                                                })}
                                                <Button size="sm" isDisabled={!state.allQuestionsAnswered} className="w-full font-black uppercase text-[10px] rounded-md h-10 bg-zinc-200 text-black hover:bg-white" onPress={actions.submitConsultation}>Send responses</Button>
                                            </motion.div>
                                        )}
                                        <SpaceCrewProgressBar progress={state.progressValue}>
                                            <div className="space-y-8">
                                                {state.tasks.map((task: any, i: number) => {
                                                    const isAgentWorking = task.status === 'working';
                                                    const isAgentDone = task.status === 'done';
                                                    
                                                    return (
                                                        <motion.div 
                                                            key={task.id} 
                                                            layout
                                                            className={cn("space-y-1.5 transition-all duration-500", isAgentWorking ? "opacity-100" : "opacity-40")}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="relative">
                                                                        <div className={cn(
                                                                            "w-6 h-6 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden shadow-sm relative shrink-0 transition-all",
                                                                            isAgentWorking ? "border-white shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "border-zinc-700"
                                                                        )}>
                                                                            {task.visualUrl ? (
                                                                                <Image 
                                                                                    src={task.visualUrl} 
                                                                                    alt={task.assignedAgentTitle}
                                                                                    fill
                                                                                    sizes="24px"
                                                                                    className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                                                />
                                                                            ) : (
                                                                                <Users size={10} className="text-zinc-500" />
                                                                            )}
                                                                        </div>
                                                                        {isAgentWorking && (
                                                                            <motion.div 
                                                                                layoutId="active-glow"
                                                                                className="absolute -inset-1 rounded-full border border-blue-400/30"
                                                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                                                transition={{ duration: 2, repeat: Infinity }}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className={cn("text-[16px] font-black uppercase tracking-tighter", isAgentWorking ? "text-white" : "text-zinc-600")}>
                                                                            {task.assignedAgentTitle}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <span className={cn("text-[8px] font-black uppercase tracking-widest", isAgentDone ? "text-zinc-400" : isAgentWorking ? "text-white" : "text-zinc-800")}>
                                                                    {task.status}
                                                                </span>
                                                            </div>
                                                            <AnimatePresence mode="wait">
                                                                {task.status !== 'pending' && (
                                                                    <motion.div 
                                                                        initial={{ opacity: 0, height: 0 }}
                                                                        animate={{ opacity: 1, height: 'auto' }}
                                                                        exit={{ opacity: 0, height: 0 }}
                                                                        className="pl-8"
                                                                    >
                                                                        <p className={cn(
                                                                            "text-[10px] font-mono leading-relaxed italic transition-all",
                                                                            isAgentWorking ? "text-zinc-400" : "text-zinc-700"
                                                                        )}>
                                                                            {task.thought || (isAgentDone ? 'Step completed.' : 'In progress...')}
                                                                        </p>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        </SpaceCrewProgressBar>
                                    </div>
                                )}

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
                                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Szczegóły:</h4>
                                                    {state.isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                                </button>
                                                
                                                <AnimatePresence mode="wait">
                                                    {state.isDetailsOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-3 mt-3 overflow-hidden"
                                                        >
                                                            <div className="text-[10px] text-zinc-400 space-y-1 font-mono">
                                                                <p>• Zespół: {(data.roles || []).join(', ')}</p>
                                                                <p>• Wykonano {state.tasks.length} zadań sekwencyjnie</p>
                                                                <p>• Wszystkie artefakty zostały wygenerowane</p>
                                                                <div className="pt-2 text-zinc-600 font-bold uppercase" suppressHydrationWarning>
                                                                    Całkowity czas: {data.metrics?.duration || '2 min 15s'} | Zużycie: {data.metrics?.tokens?.toLocaleString() || '3,200'} tokenów
                                                                </div>                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {!state.isMissingContext && (state.logs?.length || 0) > 0 && (
                                    <div className="pt-4 border-t border-zinc-900">
                                        <button onClick={() => actions.setIsLogsOpen(!state.isLogsOpen)} className="flex items-center justify-between w-full group py-1">
                                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={12} /> Sequential Logs</h4>
                                            {state.isLogsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                        </button>
                                        {state.isLogsOpen && (
                                            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-[10px] space-y-2 mt-3">
                                                {state.logs.map((log: any, i: number) => <div key={i} className="flex gap-2"><span className="text-zinc-700" suppressHydrationWarning>[{new Date().toLocaleTimeString()}]</span><span className="text-zinc-400">{log}</span></div>)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </SpaceCrewOrchestrationLayout>
                    </div>
                </Tab>

                <Tab 
                    key="context" 
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12} /> 
                            Context
                            {state.isContextComplete && state.contextRequirements.length > 0 && (
                                <CheckCircle2 size={10} className="text-white" />
                            )}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewContextTab isContextComplete={state.isContextComplete} contextRequirements={state.contextRequirements} nodeSearchQuery={state.nodeSearch} onSearchQueryChange={actions.setNodeSearch} onContextLinkChange={actions.handleContextLinkChange} onLinkContextFromNode={actions.handleLinkContextFromNode} canvasNodes={canvasNodes} />
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} /> 
                            Artefacts
                            {state.hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            ) : state.artefacts.length > 0 ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewArtefactsTab isDone={state.isDone} artefacts={state.artefacts} progressValue={state.progressValue} isWorking={state.isWorking} editingArtefactId={state.editingArtefactId} setEditingArtefactId={actions.setEditingArtefactId} expandedVersionHistory={state.expandedVersionHistory} toggleVersionHistory={actions.toggleVersionHistory} handleRestoreVersion={actions.handleRestoreVersion} handleArtefactStatusChange={actions.handleArtefactStatusChange} handleArtefactOutputToggle={actions.handleArtefactOutputToggle} handleArtefactContentChange={actions.handleArtefactContentChange} />
                    </div>
                </Tab>
            </Tabs>

            <SpaceInspectorFooter>
                {(state.isMissingContext || state.isBriefing) && (
                    <div className="space-y-3">
                        <Button size="sm" isDisabled={!state.isContextComplete} className={cn("w-full font-black uppercase text-[10px] rounded-md h-12 shadow-xl", state.isContextComplete ? "bg-white text-black hover:bg-zinc-100 shadow-white/5" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed")} onPress={() => actions.transitionTo('working')}>
                            {state.progressValue > 0 ? "Wznów pracę" : "Rozpocznij pracę"}
                        </Button>
                        {state.progressValue > 0 && <Button size="sm" variant="light" className="w-full text-zinc-500 font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-900/50" onPress={() => actions.transitionTo('aborted')}>Zakończ pracę</Button>}
                    </div>
                )}
                {(state.isWorking || state.isConsultation) && (
                    <Button size="sm" variant="flat" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10" onPress={() => actions.transitionTo('briefing')}>Zatrzymaj pracę</Button>
                )}
                {(state.isDone || state.isAborted) && (
                    <div className="flex gap-3">
                        <Button size="sm" className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-white" onPress={() => actions.transitionTo('missing_context', { tasks: [] })}>Nowe zadanie</Button>
                        <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] h-10 hover:bg-zinc-800" onPress={() => actions.setSelectedTab("artefacts")}>Historia Wersji</Button>
                    </div>
                )}
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
