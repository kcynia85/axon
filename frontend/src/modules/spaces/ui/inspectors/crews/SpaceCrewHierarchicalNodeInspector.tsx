// frontend/src/modules/spaces/ui/inspectors/crews/SpaceCrewHierarchicalNodeInspector.tsx

import React from "react";
import {
  Tabs,
  Tab,
  Button,
  Avatar
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Zap,
  CheckCircle2,
  Layers,
  FileText,
  CircleStop,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {  SharedMemoryEntry } from "@/modules/spaces/domain/types";
import { SpaceCrewInspectorProperties } from "../../types";
import { useCrewInspectorBaseLogic } from "@/modules/spaces/application/hooks/useCrewInspectorBaseLogic";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { cn } from "@/shared/lib/utils";
import { SpaceInspectorFooter } from "../../inspectors/components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "../../inspectors/components/SpaceInspectorPanel";


export const SpaceCrewHierarchicalNodeInspector = ({ 
    data, 
    nodeId,
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const logic = useCrewInspectorBaseLogic(data, onPropertyChange);
    const {
        isMissingContext, isWorking, isConsultation, isBriefing, isDone, isAborted,
        tasks, progressValue, transitionTo,
        isContextComplete, contextRequirements, nodeSearch, setNodeSearch,
        editingArtefactId, setEditingArtefactId,
        toggleVersionHistory, handleRestoreVersion,
        handleArtefactContentChange,
        sharedMemory,
        selectedTab, setSelectedTab,
        isDetailsOpen, setIsDetailsOpen
    } = logic;

    const managerTitle = data.manager_title || "Lead Architect";
    const artefacts = data.artefacts || [];

    // Simulation for Hierarchical Crew
    useQuery({
        queryKey: ["crew-worker-hierarchical", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const currentTaskIndex = tasks.findIndex(t => t.status !== 'done');
                if (currentTaskIndex !== -1) {
                    const currentTask = tasks[currentTaskIndex];
                    const nextTasks = [...tasks];
                    const nextSharedMemory = [...sharedMemory];
                    
                    if (currentTask.status === 'pending') {
                        nextTasks[currentTaskIndex] = { ...currentTask, status: 'working', thought: 'Delegating task to agent...' };
                    } else if (currentTask.status === 'working') {
                        if (Math.random() > 0.6) {
                            nextTasks[currentTaskIndex] = { ...currentTask, status: 'done', thought: 'Result reviewed and approved.' };
                            nextSharedMemory.push({
                                id: `fact_${Date.now()}`,
                                fact: "Hierarchical validation passed.",
                                sourceAgentTitle: managerTitle,
                                timestamp: new Date().toLocaleTimeString()
                            });
                        } else {
                            nextTasks[currentTaskIndex] = { ...currentTask, thought: 'Executing under supervision...' };
                        }
                    }

                    onPropertyChange({ 
                        tasks: nextTasks,
                        shared_memory: nextSharedMemory,
                        state: nextTasks.every(t => t.status === 'done') ? 'done' : 'working'
                    });
                }
                return progressValue;
            }
            return progressValue;
        },
        refetchInterval: isWorking && progressValue < 100 ? 2000 : false,
        enabled: isWorking && progressValue < 100,
    });

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Hierarchical Crew" 
                size="sm" 
                variant="underlined"
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
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
                            {isDone && <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)] pb-40">
                        <SpaceCrewOrchestrationLayout>
                            <div className="space-y-10">
                                {(isMissingContext || isBriefing) && (
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl mb-6">
                                            <Avatar name={managerTitle} size="sm" className="bg-blue-500/20 text-blue-400 font-black text-[10px]" />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white">{managerTitle}</span>
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Lead Architect</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {tasks.map((task, i) => (
                                                <motion.div 
                                                    key={task.id} 
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.1 }}
                                                    className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Avatar name={task.assignedAgentTitle} size="sm" className="w-6 h-6 bg-zinc-800 text-[8px] font-black text-zinc-400" />
                                                        <span className="text-[11px] font-black text-zinc-200">{task.assignedAgentTitle}</span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {(isWorking || isConsultation) && (
                                    <div className="space-y-10">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex flex-col gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar name={managerTitle} size="sm" className="bg-blue-500/20 text-blue-400 font-black text-[10px]" />
                                                <span className="text-[11px] font-black text-white">{managerTitle}</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 font-mono leading-relaxed italic">&quot;Supervising task delegation...&quot;</p>
                                        </motion.div>
                                        <SpaceCrewProgressBar progress={progressValue}>
                                            <div className="space-y-8">
                                                {tasks.map((task) => {
                                                    const isAgentWorking = task.status === 'working';
                                                    const isAgentDone = task.status === 'done';
                                                    
                                                    return (
                                                        <motion.div 
                                                            key={task.id} 
                                                            layout
                                                            className={cn("space-y-2 transition-all duration-500", isAgentWorking ? "opacity-100" : "opacity-60")}
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="relative">
                                                                        <Avatar name={task.assignedAgentTitle} size="sm" className={cn("w-6 h-6 text-[8px] font-black transition-all", isAgentWorking ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "bg-zinc-800 text-zinc-500")} />
                                                                        {isAgentWorking && (
                                                                            <motion.div layoutId="active-glow-h" className="absolute -inset-1 rounded-full border border-blue-400/30" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
                                                                        )}
                                                                    </div>
                                                                    <span className={cn("text-[11px] font-black uppercase tracking-tighter", isAgentWorking ? "text-white" : "text-zinc-600")}>{task.assignedAgentTitle}</span>
                                                                </div>
                                                                <span className={cn("text-[8px] font-black uppercase tracking-widest", isAgentDone ? "text-zinc-400" : isAgentWorking ? "text-white" : "text-zinc-800")}>{task.status}</span>
                                                            </div>
                                                            <AnimatePresence mode="wait">
                                                                {task.status !== 'pending' && (
                                                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pl-8">
                                                                        <p className={cn("text-[10px] font-mono leading-relaxed italic transition-all", isAgentWorking ? "text-zinc-400" : "text-zinc-700")}>{task.thought}</p>
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

                                {(isDone || isAborted) && (
                                    <div className="space-y-4">
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }} 
                                            animate={{ opacity: 1, scale: 1 }} 
                                            className="flex items-center gap-3 py-4 border-b border-zinc-900" 
                                        >
                                            {isDone ? <CheckCircle2 size={24} className="text-white" /> : <CircleStop size={24} className="text-zinc-500" />}
                                            <div>
                                                <h3 className="text-sm font-black text-white tracking-tight uppercase">{isDone ? "Wszystko gotowe!" : "Praca zatrzymana"}</h3>
                                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{isDone ? "Twój zespół przygotował materiały do przeglądu." : "Zakończyliśmy zadanie przed czasem."}</p>
                                            </div>
                                        </motion.div>

                                        {isDone && (
                                            <div className="pt-4">
                                                <button 
                                                    onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                                    className="flex items-center justify-between w-full group py-1"
                                                >
                                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Szczegóły:</h4>
                                                    {isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                                </button>
                                                
                                                <AnimatePresence mode="wait">
                                                    {isDetailsOpen && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="space-y-3 mt-3 overflow-hidden"
                                                        >
                                                            <div className="text-[10px] text-zinc-400 space-y-1 font-mono">
                                                                <p>• Menedżer: {managerTitle}</p>
                                                                <p>• Wykonano {(tasks || []).length} zadań pod nadzorem</p>
                                                                <p>• Wszystkie kroki zatwierdzone</p>
                                                                <div className="pt-2 text-zinc-600 font-bold uppercase" suppressHydrationWarning>
                                                                    Całkowity czas: {data.metrics?.duration || '3 min 40s'} | Zużycie: {data.metrics?.tokens?.toLocaleString() || '4,500'} tokenów
                                                                </div>                                                            </div>
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

                <Tab 
                    key="context" 
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12} /> 
                            Context
                            {isContextComplete && contextRequirements.length > 0 && (
                                <CheckCircle2 size={10} className="text-white" />
                            )}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewContextTab isContextComplete={isContextComplete} contextRequirements={contextRequirements} nodeSearch={nodeSearch} setNodeSearch={setNodeSearch} handleContextLinkChange={logic.handleContextLinkChange} handleLinkContextFromNode={logic.handleLinkContextFromNode} />
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} /> 
                            Artefacts
                            {artefacts.some(a => a.status === 'in_review') ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            ) : artefacts.length > 0 ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewArtefactsTab isDone={isDone} artefacts={data.artefacts || []} progressValue={progressValue} isWorking={isWorking} editingArtefactId={editingArtefactId} setEditingArtefactId={setEditingArtefactId} expandedVersionHistory={logic.expandedVersionHistory} toggleVersionHistory={toggleVersionHistory} handleRestoreVersion={handleRestoreVersion} handleArtefactStatusChange={logic.handleArtefactStatusChange} handleArtefactOutputToggle={logic.handleArtefactOutputToggle} handleArtefactContentChange={handleArtefactContentChange} />
                    </div>
                </Tab>
            </Tabs>

            <SpaceInspectorFooter>
                {(isMissingContext || isBriefing) && (
                    <div className="space-y-3">
                        <Button size="sm" isDisabled={!isContextComplete} className={cn("w-full font-black uppercase text-[10px] rounded-md h-10 transition-all shadow-xl", isContextComplete ? "bg-white text-black hover:bg-zinc-100 shadow-white/5" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed")} onPress={() => transitionTo('working')}>
                            {progressValue > 0 ? "Wznów pracę" : "Rozpocznij pracę"}
                        </Button>
                        {progressValue > 0 && <Button size="sm" variant="light" className="w-full text-zinc-500 font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-900/50" onPress={() => transitionTo('aborted')}>Zakończ pracę</Button>}
                    </div>
                )}
                {(isWorking || isConsultation) && (
                    <Button size="sm" variant="flat" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10" onPress={() => transitionTo('briefing')}>Zatrzymaj pracę</Button>
                )}
                {(isDone || isAborted) && (
                    <div className="flex gap-3">
                        <Button size="sm" className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-white" onPress={() => transitionTo('missing_context', { tasks: [] })}>Nowe zadanie</Button>
                        <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] h-10 hover:bg-zinc-800" onPress={() => setSelectedTab("artefacts")}>Historia Wersji</Button>
                    </div>
                )}
            </SpaceInspectorFooter>
        </SpaceInspectorPanel>
    );
};
