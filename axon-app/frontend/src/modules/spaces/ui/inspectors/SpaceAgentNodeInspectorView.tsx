"use client";

import React from "react";
import Image from "next/image";
import { Tabs, Tab, Input, ScrollShadow, Button } from "@heroui/react";
import { 
  Bot, Layers, FileText, CheckCircle2, ChevronDown, ChevronUp, AlertCircle, ShieldCheck, Zap, CircleStop, Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { type Node } from "@xyflow/react";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./crews/shared/SpaceCrewContextTab";
import { SpaceCognitionTab } from "./shared/SpaceCognitionTab";
import { SpaceCrewArtefactsTab } from "./crews/shared/SpaceCrewArtefactsTab";
import { SpaceInspectorFooter } from "./components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "./components/SpaceInspectorPanel";

export type SpaceAgentNodeInspectorViewProperties = {
    readonly state: any;
    readonly actions: any;
    readonly agentData: any;
    readonly nodeId: string;
    readonly onStatusChange?: (nodeId: string, status: string) => void;
    readonly onRunNode?: (nodeId: string, userInput: string) => Promise<void>;
    readonly canvasNodes: Node[];
};

/**
 * SpaceAgentNodeInspectorView - Pure view component for agent node details.
 */
export const SpaceAgentNodeInspectorView = ({ state, actions, agentData, nodeId, onStatusChange, onRunNode, canvasNodes }: SpaceAgentNodeInspectorViewProperties) => {
    const handleRun = async () => {
        if (!onRunNode) return;
        
        // Gather all context from the requirements
        const contextSummary = state.contextRequirements.map((r: any) => {
            const value = r.link || r.sourceNodeLabel ? `${r.sourceNodeLabel}/${r.sourceArtifactLabel}` : "NOT_PROVIDED";
            return `${r.label}: ${value}`;
        }).join('\n');

        const finalInput = contextSummary.trim() || "Execute assigned role instructions.";
        await onRunNode(nodeId, finalInput);
    };

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Inspector" 
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
                <Tab key="agent" title={<div className="flex items-center gap-2"><Bot size={12}/> Agent {state.isDone && <CheckCircle2 size={10} className="text-white"/>}</div>}>
                    <div className="h-[calc(100vh-192px)]">
                        <ScrollShadow className="p-8 h-full pb-48">
                            {/* HEADER / VISUAL SECTION */}
                            <div className="mb-10 flex flex-col items-center text-center space-y-4">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full border-4 border-zinc-700 bg-black flex items-center justify-center overflow-hidden  relative shrink-0">
                                        {agentData.agent_visual_url ? (
                                            <Image 
                                                src={agentData.agent_visual_url} 
                                                alt={agentData.label}
                                                fill
                                                sizes="64px"
                                                className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                            />
                                        ) : (
                                            <Bot size={24} className="text-zinc-500" />
                                        )}
                                    </div>
                                    <div className={cn(
                                        "absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-4 border-black flex items-center justify-center",
                                        state.isWorking ? "bg-blue-500 animate-pulse" : state.isDone ? "bg-green-500" : "bg-zinc-700"
                                    )}>
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <h2 className="text-lg font-black text-white tracking-tighter">{agentData.label}</h2>
                                    <p className="text-[16px] font-black text-zinc-500">{agentData.agent_name || "Autonomous Agent"}</p>
                                </div>
                            </div>

                            {(state.isMissingContext || state.isBriefing) && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl space-y-2">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <AlertCircle size={12} />
                                            <h3 className="text-[9px] font-black uppercase tracking-widest">Agent Goal</h3>
                                        </div>
                                        <p className="text-[12px] text-zinc-400 font-medium leading-relaxed">
                                            {state.isContextComplete 
                                                ? "Wszystkie dane są gotowe. Możemy przygotować briefing i rozpocząć generowanie treści." 
                                                : `Aby Agent mógł pracować, uzupełnij wymagane parametry w zakładce Context.`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {state.isConsultation && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 py-1 text-zinc-400">
                                        <AlertCircle size={14} />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Consultation Required</h3>
                                    </div>
                                    <div className="space-y-5">
                                        {state.consultationQuestions.map((questionItem: any) => {
                                            const isAnswered = (state.consultationAnswers[questionItem.id] || questionItem.answer || "").trim().length > 0;
                                            return (
                                                <div key={questionItem.id} className="space-y-2.5">
                                                    <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">{questionItem.question}</p>
                                                    <Input 
                                                        placeholder="Type your answer..." 
                                                        size="sm" 
                                                        variant="bordered"
                                                        value={state.consultationAnswers[questionItem.id] || questionItem.answer || ""}
                                                        onValueChange={(value) => actions.handleAnswerChange(questionItem.id, value)}
                                                        endContent={isAnswered && <CheckCircle2 size={14} className="text-white" />}
                                                        classNames={{ 
                                                            input: "text-xs font-mono text-zinc-300", 
                                                            inputWrapper: cn(
                                                                "h-11 bg-zinc-900 rounded-lg transition-all  border",
                                                                isAnswered ? "border-white border-2" : "border-zinc-800 hover:border-zinc-700 focus-within:!border-zinc-200"
                                                            )
                                                        }} 
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {state.isAlignment && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 py-1 text-zinc-400">
                                        <ShieldCheck size={14} />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Alignment / Understanding Check</h3>
                                    </div>

                                    <div className="p-5 bg-zinc-900 border border-zinc-200 rounded-xl space-y-3">
                                        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Agent understanding:</span>
                                        <p className="text-xs text-zinc-300 font-mono leading-relaxed italic">
                                            &quot;{agentData.alignment_summary}&quot;
                                        </p>
                                    </div>
                                </div>
                            )}

                            {state.isBriefing && (
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plan pracy:</h4>
                                    <div className="space-y-2">
                                        {(agentData.plan_steps || [
                                            { id: '1', label: 'Wczytam i oczyszczę Twoje dane.', status: 'pending' },
                                            { id: '2', label: 'Przeszukam rekordy w poszukiwaniu nietypowych wzorców.', status: 'pending' },
                                            { id: '3', label: 'Zapiszę rekomendacje co zrobić z wynikami.', status: 'pending' }
                                        ]).map((stepItem: any) => (
                                            <div key={stepItem.id} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                                <span className="text-[11px] text-zinc-300 font-mono">Krok {stepItem.id}: {stepItem.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-zinc-900">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Koszt:</span>
                                            <span className="text-[10px] font-mono text-zinc-300">~ {agentData.metrics?.tokens || '8k'} tokenów (ok. ${agentData.metrics?.cost || '0.50'})</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {state.isWorking && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end min-h-[24px]">
                                            <div className="flex flex-col gap-1">
                                                <AnimatePresence mode="wait">
                                                    <motion.p 
                                                        key={state.currentTaskLabel}
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="text-[11px] text-white font-bold text-shimmer"
                                                    >
                                                        {state.currentTaskLabel}
                                                    </motion.p>
                                                </AnimatePresence>
                                            </div>
                                            <span className="text-[10px] font-mono text-white">{agentData.progress}%</span>
                                        </div>
                                        <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-white [0_0_10px_white]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${agentData.progress}%` }}
                                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-zinc-900">
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
                                                    <div className="space-y-1.5">
                                                        {state.workingLogs.map((logItem: any, index: number) => {
                                                            const isLogDone = agentData.progress > logItem.threshold;
                                                            const isLogCurrent = agentData.progress >= logItem.threshold && (index === state.workingLogs.length - 1 || agentData.progress < state.workingLogs[index+1].threshold);
                                                            return (
                                                                <div key={index} className={cn(
                                                                    "text-[10px] font-mono flex gap-2",
                                                                    isLogDone ? "text-zinc-500" : isLogCurrent ? "text-white" : "text-zinc-700 "
                                                                )}>
                                                                    <span className={cn("font-bold", isLogDone ? "text-zinc-600" : isLogCurrent ? "text-white" : "text-zinc-800")}>
                                                                        {isLogDone ? "[Done]" : isLogCurrent ? "[Processing]" : "[Pending]"}
                                                                    </span> 
                                                                    {logItem.label}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div className="space-y-1 pt-3 border-t border-zinc-900">
                                                        <div className="flex justify-between text-[10px] font-mono">
                                                            <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Zużyto:</span>
                                                            <span className="text-zinc-300 tabular-nums" suppressHydrationWarning>{state.simulatedTokens.toLocaleString()} tokenów</span>
                                                        </div>
                                                        <div className="flex justify-between text-[10px] font-mono pt-1">
                                                            <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Czas:</span>
                                                            <span className="text-zinc-500 italic">Minęło: {actions.formatTime(state.elapsedSeconds)} | Pozostało: ~{actions.formatTime(state.remainingSeconds)}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {state.isCritique && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 py-1 text-zinc-400">
                                        <Zap size={14} className="text-white animate-pulse" />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Self-Critique & Review</h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-mono text-zinc-400 animate-pulse">Running autonomous review...</span>
                                            <span className="text-[10px] font-mono text-white">95%</span>
                                        </div>
                                        <div className="space-y-2">
                                            {[
                                                "Sprawdzanie spójności z briefem...",
                                                "Weryfikacja faktów i danych...",
                                                "Optymalizacja stylu i tonu...",
                                            ].map((noteText, noteIndex) => (
                                                <div key={noteIndex} className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
                                                    <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                                                    <span className="text-[10px] font-mono text-zinc-300">{noteText}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{state.isDone ? "Twój agent przygotował materiały do przeglądu." : "Zakończyliśmy zadanie przed czasem."}</p>
                                        </div>
                                    </motion.div>
                                    
                                    <div className="pt-4 border-t border-zinc-900">
                                        <button 
                                            onClick={() => actions.setIsDetailsOpen(!state.isDetailsOpen)}
                                            className="flex items-center justify-between w-full group py-1"
                                        >
                                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Execution Result:</h4>
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
                                                            {agentData.final_output || "No output generated yet."}
                                                        </p>
                                                    </div>

                                                    {agentData.execution_trace && agentData.execution_trace.length > 0 && (
                                                        <div className="space-y-3">
                                                            <h5 className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Tool Usage & Thought Trace:</h5>
                                                            <div className="space-y-2">
                                                                {agentData.execution_trace.map((step: any, idx: number) => (
                                                                    <div key={idx} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg space-y-2">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-[9px] font-black text-white px-2 py-0.5 bg-zinc-800 rounded uppercase">{step.tool}</span>
                                                                        </div>
                                                                        <p className="text-[10px] text-zinc-400 italic">"{step.thought}"</p>
                                                                        {step.observation && (
                                                                            <div className="text-[9px] font-mono text-zinc-500 bg-black/50 p-2 rounded">
                                                                                Obs: {step.observation.substring(0, 100)}...
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="pt-2 text-zinc-600 font-bold uppercase text-[9px]" suppressHydrationWarning>
                                                        Całkowity czas: {agentData.metrics?.duration || '4 min'} | Zużycie: {state.simulatedTokens.toLocaleString()} tokenów
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}
                        </ScrollShadow>
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
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewContextTab 
                            isContextComplete={state.isContextComplete}
                            contextRequirements={state.contextRequirements}
                            nodeSearchQuery={state.nodeSearch}
                            onSearchQueryChange={actions.setNodeSearch}
                            onContextLinkChange={actions.handleContextLinkChange}
                            onLinkContextFromNode={actions.handleLinkContextFromNode}
                            canvasNodes={canvasNodes}
                        />
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} /> 
                            Artefacts
                            {state.hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse [0_0_8px_rgb(0,0,0)]" />
                            ) : state.artefactsList.length > 0 ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewArtefactsTab 
                            isDone={state.isDone}
                            artefacts={state.artefactsList}
                            progressValue={agentData.progress}
                            isWorking={state.isWorking}
                            editingArtefactId={state.editingArtefactId}
                            setEditingArtefactId={actions.setEditingArtefactId}
                            expandedVersionHistory={state.expandedVersionHistory}
                            toggleVersionHistory={actions.toggleVersionHistory}
                            handleRestoreVersion={actions.handleRestoreVersion}
                            handleArtefactStatusChange={actions.handleArtefactStatusChange}
                            handleArtefactOutputToggle={actions.handleArtefactOutputToggle}
                            handleArtefactContentChange={actions.handleArtefactContentChange}
                        />
                    </div>
                </Tab>
            </Tabs>

            {state.selectedTab === 'agent' && (
                <SpaceInspectorFooter>
                    {state.isMissingContext && (
                        <div className="space-y-3">
                            <Button 
                                size="lg" 
                                isDisabled={state.isWorking}
                                className="text-base font-bold bg-white text-black hover:bg-zinc-200 border-none transition-all active:scale-95 px-8"
                                onPress={handleRun}
                            >
                                {agentData.progress > 0 ? "Wznów pracę" : "Rozpocznij pracę"}
                            </Button>
                        </div>
                    )}
                    {state.isConsultation && (
                        <Button size="sm" isDisabled={!state.allQuestionsAnswered} className="w-full font-black uppercase text-[10px] rounded-md h-10 bg-white text-black hover:bg-zinc-100 " onPress={actions.submitConsultation}>
                            Send responses
                        </Button>
                    )}
                    {state.isAlignment && (
                        <div className="flex flex-col gap-3">
                            <Button 
                                size="sm" 
                                className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-100 "
                                onPress={() => actions.transitionTo('briefing')}
                            >
                                Looks correct, proceed to plan
                            </Button>
                            <Button 
                                size="sm" 
                                variant="flat" 
                                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10"
                                onPress={() => actions.transitionTo('conversation')}
                            >
                                Adjust assumptions
                            </Button>
                        </div>
                    )}
                    {state.isBriefing && (
                        <div className="flex gap-3">
                            <Button size="sm" className="flex-1 bg-white text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-100 " onPress={() => actions.transitionTo('working', { progress: 5 })}>Tak, Zaczynaj</Button>
                            <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10" onPress={() => actions.transitionTo('missing_context')}>Zmień Plan</Button>
                        </div>
                    )}
                    {state.isWorking && (
                        <Button size="sm" variant="flat" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10 hover:bg-red-950 hover:text-red-500 hover:border-red-900 transition-all" onPress={() => actions.transitionTo('conversation')}>Zatrzymaj pracę</Button>
                    )}
                    {state.isCritique && (
                        <Button size="sm" className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 " onPress={() => actions.transitionTo('done', { progress: 100 })}>Finalize output</Button>
                    )}
                    {(state.isDone || state.isAborted) && (
                        <div className="flex gap-3">
                            <Button size="sm" className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-white" onPress={() => actions.transitionTo('missing_context', { progress: 0 })}>Nowe zadanie</Button>
                            <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-800" onPress={() => actions.setSelectedTab("artefacts")}>Historia Wersji</Button>
                        </div>
                    )}
                </SpaceInspectorFooter>
            )}
        </SpaceInspectorPanel>
    );
};
