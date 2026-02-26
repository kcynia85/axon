// frontend/src/modules/spaces/ui/inspectors/crews/SpaceCrewHierarchicalNodeInspector.tsx

import React from "react";
import {
  CardBody,
  Tabs,
  Tab,
  Input,
  Button,
  Avatar
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { 
  ChevronUp,
  ChevronDown,
  Zap,
  CheckCircle2,
  Layers,
  FileText,
  CircleStop
} from "lucide-react";
import { SpaceCrewInspectorProperties } from "../../../domain/types";
import { useCrewInspectorBaseLogic } from "../../../application/hooks/useCrewInspectorBaseLogic";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { cn } from "@/shared/lib/utils";

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
        selectedTab, setSelectedTab, isDetailsOpen, setIsDetailsOpen
    } = {
        ...logic
    };

    const managerTitle = data.manager_title || "Lead Architect";

    // Simulation for Hierarchical Crew
    useQuery({
        queryKey: ["crew-worker-hierarchical", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const currentTaskIndex = tasks.findIndex(t => t.status !== 'done');
                if (currentTaskIndex !== -1) {
                    const nextTasks = [...tasks];
                    const nextSharedMemory = [...sharedMemory];
                    const currentTask = nextTasks[currentTaskIndex];
                    
                    if (currentTask.status === 'pending') {
                        nextTasks[currentTaskIndex] = { ...currentTask, status: 'working', thought: 'Delegating task to agent...' };
                    } else if (currentTask.status === 'working') {
                        // eslint-disable-next-line react-hooks/purity
                        if (Math.random() > 0.6) {
                            nextTasks[currentTaskIndex] = { ...currentTask, status: 'done', thought: 'Result reviewed and approved.' };
                            nextSharedMemory.push({
                                // eslint-disable-next-line react-hooks/purity
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
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Hierarchical Crew Inspector" 
                size="sm" 
                variant="underlined"
                selectedKey={selectedTab}
                onSelectionChange={(key) => setSelectedTab(key as string)}
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors"
                }}
            >
                <Tab key="orchestration" title={<div className="flex items-center gap-2"><Zap size={12}/> Team</div>}>
                    <SpaceCrewOrchestrationLayout
                        footer={
                            <div className="space-y-3">
                                {(isMissingContext || isBriefing) && (
                                    <div className="space-y-3">
                                        <Button 
                                            size="sm" 
                                            isDisabled={!isContextComplete}
                                            className={cn(
                                                "w-full font-black uppercase text-[10px] tracking-widest rounded-md h-12 transition-all shadow-xl",
                                                isContextComplete ? "bg-white text-black hover:bg-zinc-100 shadow-white/5" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                                            )}
                                            onPress={() => transitionTo('working')}
                                        >
                                            {progressValue > 0 ? "Wznów pracę" : "Rozpocznij pracę"}
                                        </Button>
                                        
                                        {progressValue > 0 && (
                                            <Button 
                                                size="sm" 
                                                variant="light" 
                                                className="w-full text-zinc-500 font-black uppercase text-[10px] tracking-widest rounded-md h-10 hover:bg-zinc-900/50"
                                                onPress={() => transitionTo('aborted')}
                                            >
                                                Zakończ pracę
                                            </Button>
                                        )}
                                    </div>
                                )}

                                {(isWorking || isConsultation) && (
                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md h-10"
                                        onPress={() => transitionTo('briefing')}
                                    >
                                        Zatrzymaj pracę
                                    </Button>
                                )}

                                {(isDone || isAborted) && (
                                    <div className="flex gap-3">
                                        <Button 
                                            size="sm" 
                                            className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md h-10 hover:bg-white" 
                                            onPress={() => transitionTo('missing_context', { tasks: [] })}
                                        >
                                            Restart Team
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="flat"
                                            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest h-10 hover:bg-zinc-800"
                                            onPress={() => setSelectedTab("artefacts")}
                                        >
                                            Historia Wersji
                                        </Button>
                                    </div>
                                )}
                            </div>
                        }
                    >
                        <div className="space-y-10">
                            {(isMissingContext || isBriefing) && (
                                <div className="space-y-10">
                                    <div className="space-y-5">
                                        <div className="flex items-center gap-3 p-4 bg-zinc-900/30 border border-zinc-800 rounded-2xl mb-6">
                                            <Avatar 
                                                name={managerTitle} 
                                                size="sm" 
                                                className="bg-blue-500/20 text-blue-400 font-black text-[10px]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white">{managerTitle}</span>
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Lead Architect</span>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            {tasks.map((task) => (
                                                <div key={task.id} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar 
                                                            name={task.assignedAgentTitle} 
                                                            size="sm" 
                                                            className="w-6 h-6 bg-zinc-800 text-[8px] font-black text-zinc-400"
                                                        />
                                                        <span className="text-[11px] font-black text-zinc-200">{task.assignedAgentTitle}</span>
                                                    </div>
                                                    <Input
                                                        size="sm"
                                                        variant="underlined"
                                                        value={task.label}
                                                        onValueChange={(val) => logic.handleTaskLabelChange(task.id, val)}
                                                        classNames={{ input: "text-[10px] font-bold text-zinc-300 italic", inputWrapper: "h-8 border-zinc-800 px-0" }}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(isWorking || isConsultation) && (
                                <div className="space-y-10">
                                    {/* Manager Overview in Working State */}
                                    <div className="flex flex-col gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <Avatar 
                                                name={managerTitle} 
                                                size="sm" 
                                                className="bg-blue-500/20 text-blue-400 font-black text-[10px]"
                                            />
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-black text-white">{managerTitle}</span>
                                                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-tight">Managing Tasks</span>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-mono leading-relaxed italic px-1">
                                            &quot;Supervising task delegation and maintaining quality standards...&quot;
                                        </p>
                                    </div>

                                    <SpaceCrewProgressBar progress={progressValue} className="space-y-8">
                                        <div className="space-y-8">
                                            {tasks.map((task) => {
                                                const isAgentWorking = task.status === 'working';
                                                const isAgentDone = task.status === 'done';
                                                
                                                return (
                                                    <div key={task.id} className={cn("space-y-2 transition-all duration-500", isAgentWorking ? "opacity-100" : "opacity-60")}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Avatar 
                                                                    name={task.assignedAgentTitle} 
                                                                    size="sm" 
                                                                    className={cn(
                                                                        "w-6 h-6 text-[8px] font-black transition-all",
                                                                        isAgentWorking ? "bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]" : "bg-zinc-800 text-zinc-500"
                                                                    )}
                                                                />
                                                                <span className={cn("text-[11px] font-black uppercase tracking-tighter", isAgentWorking ? "text-white" : "text-zinc-600")}>{task.assignedAgentTitle}</span>
                                                            </div>
                                                            <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded transition-all", 
                                                                isAgentDone ? "text-zinc-700" : 
                                                                isAgentWorking ? "text-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/5" : 
                                                                "text-zinc-800")}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        <div className="pl-8">
                                                            {task.status !== 'pending' && <p className={cn("text-[10px] font-mono leading-relaxed", isAgentWorking ? "text-zinc-500" : "text-zinc-700")}>{task.thought}</p>}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </SpaceCrewProgressBar>
                                </div>
                            )}

                            {isAborted && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 py-4 border-b border-zinc-900">
                                        <div className="p-3 rounded-full bg-zinc-500/10 text-zinc-500 border border-zinc-500/20">
                                            <CircleStop size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase">Praca Przerwana</h3>
                                            <p className="text-[10px] text-zinc-500 font-bold">Proces został zakończony ręcznie bez rezultatu.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isDone && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 py-4 border-b border-zinc-900">
                                        <div className="p-3 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase">Hierarchy Done</h3>
                                            <p className="text-[10px] text-zinc-500 font-bold">{managerTitle} approved all results.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <button 
                                            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                            className="flex items-center justify-between w-full group py-1"
                                        >
                                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Szczegóły:</h4>
                                            {isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                        </button>
                                        
                                        {isDetailsOpen && (
                                            <div className="text-[10px] text-zinc-400 space-y-2.5 font-mono bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800 animate-in fade-in slide-in-from-top-1 duration-200">
                                                <p className="flex justify-between"><span className="text-zinc-600">Model:</span> <span className="text-zinc-300">Hierarchical Engine (GPT-4o)</span></p>
                                                <p className="flex justify-between"><span className="text-zinc-600">Czas:</span> <span className="text-zinc-300">{data.metrics?.duration || '3 min 45s'}</span></p>
                                                <p className="flex justify-between"><span className="text-zinc-600">Zużycie:</span> <span className="text-zinc-300">~ {data.metrics?.tokens || '5,200'} tokenów</span></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </SpaceCrewOrchestrationLayout>
                </Tab>

                <Tab key="context" title={<div className="flex items-center gap-2"><Layers size={12} /> Context</div>}>
                    <SpaceCrewContextTab 
                        isContextComplete={isContextComplete}
                        contextRequirements={contextRequirements}
                        nodeSearch={nodeSearch}
                        setNodeSearch={setNodeSearch}
                        handleContextLinkChange={logic.handleContextLinkChange}
                        handleLinkContextFromNode={logic.handleLinkContextFromNode}
                    />
                </Tab>

                <Tab key="artefacts" title={<div className="flex items-center gap-2"><FileText size={12} /> Artefacts</div>}>
                    <SpaceCrewArtefactsTab 
                        isDone={isDone}
                        artefacts={data.artefacts || []}
                        progressValue={progressValue}
                        isWorking={isWorking}
                        editingArtefactId={editingArtefactId}
                        setEditingArtefactId={setEditingArtefactId}
                        expandedVersionHistory={logic.expandedVersionHistory}
                        toggleVersionHistory={toggleVersionHistory}
                        handleRestoreVersion={handleRestoreVersion}
                        handleArtefactStatusChange={logic.handleArtefactStatusChange}
                        handleArtefactOutputToggle={logic.handleArtefactOutputToggle}
                        handleArtefactContentChange={handleArtefactContentChange}
                    />
                </Tab>
            </Tabs>
        </CardBody>
    );
};
