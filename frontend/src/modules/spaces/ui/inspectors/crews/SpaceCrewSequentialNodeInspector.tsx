// frontend/src/modules/spaces/ui/inspectors/crews/SpaceCrewSequentialNodeInspector.tsx

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
  Terminal,
  ChevronUp,
  ChevronDown,
  Zap,
  MessageSquare,
  CheckCircle2,
  Layers,
  FileText,
  CircleStop
} from "lucide-react";
import { SpaceCrewInspectorProperties, SharedMemoryEntry } from "../../../domain/types";
import { useCrewInspectorBaseLogic } from "../../../application/hooks/useCrewInspectorBaseLogic";
import { SpaceCrewContextTab } from "./shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./shared/SpaceCrewArtefactsTab";
import { SpaceCrewProgressBar } from "./shared/SpaceCrewProgressBar";
import { SpaceCrewOrchestrationLayout } from "./shared/SpaceCrewOrchestrationLayout";
import { cn } from "@/shared/lib/utils";

export const SpaceCrewSequentialNodeInspector = ({ 
    data, 
    nodeId,
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const logic = useCrewInspectorBaseLogic(data, onPropertyChange);
    const {
        isMissingContext, isWorking, isConsultation, isBriefing, isDone, isAborted,
        tasks, progressValue, transitionTo, handleAnswerChange,
        allQuestionsAnswered, consultationAnswers, consultationQuestions,
        sharedMemory,
        isContextComplete, contextRequirements, nodeSearch, setNodeSearch,
        editingArtefactId, setEditingArtefactId,
        toggleVersionHistory, handleRestoreVersion,
        handleArtefactContentChange,
        selectedTab, setSelectedTab, isDetailsOpen, setIsDetailsOpen
    } = {
        ...logic,
        // Mock questions if needed
        consultationQuestions: data.consultation_questions || (logic.isConsultation ? [
            { id: 'q1', question: 'Jaki jest priorytet dla tego zespołu?' },
            { id: 'q2', question: 'Czy są jakieś specyficzne ograniczenia budżetowe?' },
        ] : []),
        allQuestionsAnswered: (data.consultation_questions || []).every(q => 
            (q.answer && q.answer.trim().length > 0) || 
            (logic.consultationAnswers[q.id] && logic.consultationAnswers[q.id].trim().length > 0)
        ) || true
    };

    // Simulation of dynamic working process for Sequential Crew
    useQuery({
        queryKey: ["crew-worker-sequential", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const currentTaskIndex = tasks.findIndex(t => t.status !== 'done');
                if (currentTaskIndex !== -1) {
                    const currentTask = tasks[currentTaskIndex];
                    const nextTasks = [...tasks];
                    const nextSharedMemory = [...sharedMemory];
                    
                    if (currentTask.status === 'pending') {
                        nextTasks[currentTaskIndex] = { ...currentTask, status: 'working', thought: 'Initializing sequential task...' };
                    } else if (currentTask.status === 'working') {
                        // eslint-disable-next-line react-hooks/purity
                        if (Math.random() > 0.7) {
                            nextTasks[currentTaskIndex] = { ...currentTask, status: 'done', thought: 'Task completed successfully.' };
                            const facts = ["Sequential step finalized.", "Data passed to next agent."];
                            const newFact: SharedMemoryEntry = {
                                // eslint-disable-next-line react-hooks/purity
                                id: `fact_${Date.now()}`,
                                // eslint-disable-next-line react-hooks/purity
                                fact: facts[Math.floor(Math.random() * facts.length)],
                                sourceAgentTitle: currentTask.assignedAgentTitle,
                                timestamp: new Date().toLocaleTimeString()
                            };
                            nextSharedMemory.push(newFact);
                        } else {
                            nextTasks[currentTaskIndex] = { ...currentTask, thought: 'Processing in order...' };
                        }
                    }

                    // eslint-disable-next-line react-hooks/purity
                    const nextTokens = (data.metrics?.tokens || 3200) + Math.floor(Math.random() * 50);
                    const allDone = nextTasks.every(t => t.status === 'done');

                    onPropertyChange({ 
                        tasks: nextTasks,
                        shared_memory: nextSharedMemory,
                        metrics: {
                            ...data.metrics,
                            tokens: nextTokens,
                            duration: data.metrics?.duration || '2 min 15s'
                        },
                        state: allDone ? 'done' : 'working'
                    });
                }
                return progressValue;
            }
            return progressValue;
        },
        refetchInterval: isWorking && progressValue < 100 ? 2000 : false,
        enabled: isWorking && progressValue < 100,
    });

    const submitConsultation = () => {
        const updatedQuestions = consultationQuestions.map((q: { id: string; question: string; answer?: string }) => ({
            ...q,
            answer: consultationAnswers[q.id] || q.answer
        }));
        
        transitionTo('working', { 
            consultation_questions: updatedQuestions,
            execution_logs: [
                ...(data.execution_logs || []),
                ...updatedQuestions.map((q: { question: string }) => `Consultation response provided for: ${q.question}`)
            ]
        });
    };

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Sequential Crew Inspector" 
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
                                                isContextComplete 
                                                    ? "bg-white text-black hover:bg-zinc-100 shadow-white/5" 
                                                    : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
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
                                            Nowe zadanie
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
                        <div className="flex flex-col justify-start space-y-10">
                            {(isMissingContext || isBriefing) && (
                                <div className="space-y-10">
                                    <div className="space-y-5">
                                        <div className="space-y-4">
                                            {tasks.map((task, i) => (
                                                <div key={task.id} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                                                    <div className="flex items-center gap-2">
                                                        <Avatar 
                                                            name={task.assignedAgentTitle} 
                                                            size="sm" 
                                                            className="w-6 h-6 bg-zinc-800 text-[8px] font-black text-zinc-400"
                                                        />
                                                        <span className="text-[11px] font-black text-zinc-200">{i + 1}. {task.assignedAgentTitle}</span>
                                                    </div>
                                                    <div className="space-y-1.5 pl-4">
                                                        <label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Zadanie (Goal)</label>
                                                        <Input
                                                            size="sm"
                                                            variant="underlined"
                                                            value={task.label}
                                                            onValueChange={(val) => logic.handleTaskLabelChange(task.id, val)}
                                                            classNames={{
                                                                input: "text-[10px] font-bold text-zinc-300 italic",
                                                                inputWrapper: "h-8 border-zinc-800 hover:border-zinc-600 px-0"
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(isWorking || isConsultation) && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        {isConsultation ? (
                                            <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare size={12} className="text-orange-400" />
                                                Consultation Required
                                            </h3>
                                        ) : <div />}
                                    </div>

                                    {isConsultation && (
                                        <div className="space-y-5 p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                                            {consultationQuestions.map((q: { id: string; question: string; answer?: string }) => (
                                                <div key={q.id} className="space-y-2.5">
                                                    <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">{q.question}</p>
                                                    <Input 
                                                        placeholder="Type your answer..." 
                                                        size="sm" 
                                                        variant="bordered"
                                                        value={consultationAnswers[q.id] || q.answer || ""}
                                                        onValueChange={(val) => handleAnswerChange(q.id, val)}
                                                        classNames={{ 
                                                            input: "text-xs font-mono text-zinc-300", 
                                                            inputWrapper: "bg-black border-zinc-800 hover:border-zinc-700 focus-within:!border-zinc-200 rounded-lg h-10 shadow-none" 
                                                        }} 
                                                    />
                                                </div>
                                            ))}
                                            <Button 
                                                size="sm" 
                                                isDisabled={!allQuestionsAnswered}
                                                className={cn(
                                                    "w-full font-black uppercase text-[10px] tracking-widest rounded-md transition-all mt-2 h-10",
                                                    allQuestionsAnswered ? "bg-zinc-200 text-black hover:bg-white" : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                                                )}
                                                onPress={submitConsultation}
                                            >
                                                Send responses
                                            </Button>
                                        </div>
                                    )}

                                    <SpaceCrewProgressBar progress={progressValue} className="space-y-8">
                                            {tasks.map((task, i) => {
                                                const isAgentWorking = task.status === 'working';
                                                const isAgentDone = task.status === 'done';
                                                
                                                return (
                                                    <div key={task.id} className={cn(
                                                        "space-y-1 transition-all duration-500", 
                                                        isAgentWorking ? "opacity-100" : "opacity-40"
                                                    )}>
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
                                                                <span className={cn(
                                                                    "text-[11px] font-black uppercase tracking-tighter", 
                                                                    isAgentWorking ? "text-white" : "text-zinc-600"
                                                                )}>
                                                                    {i+1}. {task.assignedAgentTitle}
                                                                </span>
                                                            </div>
                                                            <span className={cn(
                                                                "text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded transition-all", 
                                                                isAgentDone ? "text-zinc-700" : 
                                                                isAgentWorking ? "text-white animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/5" : 
                                                                "text-zinc-800"
                                                            )}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                        {task.status !== 'pending' && (
                                                            <div className="pl-8">
                                                                <p className={cn(
                                                                    "text-[10px] font-mono leading-relaxed transition-all",
                                                                    isAgentWorking ? "text-zinc-500" : "text-zinc-700"
                                                                )}>
                                                                    {task.thought || (isAgentDone ? 'Step completed.' : 'In progress...')}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
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
                                        <div className="p-3 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase">Sekwencja Zakończona</h3>
                                            <p className="text-[10px] text-zinc-500 font-bold">Wszystkie kroki zostały pomyślnie zrealizowane.</p>
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
                                                <p className="flex justify-between"><span className="text-zinc-600">Model:</span> <span className="text-zinc-300">Hybrid Crew (GPT-4o + Claude 3.5)</span></p>
                                                <p className="flex justify-between"><span className="text-zinc-600">Czas:</span> <span className="text-zinc-300">{data.metrics?.duration || '4 min 12s'}</span></p>
                                                <p className="flex justify-between"><span className="text-zinc-600">Zużycie:</span> <span className="text-zinc-300">~ {data.metrics?.tokens || '6,800'} tokenów</span></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isMissingContext && logs.length > 0 && (
                                <div className="pt-4 border-t border-zinc-900">
                                    <button onClick={() => setIsLogsOpen(!isLogsOpen)} className="flex items-center justify-between w-full group py-1">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Terminal size={12} /> Sequential Logs</h4>
                                        {isLogsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                    </button>
                                    {isLogsOpen && (
                                        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-[10px] space-y-2 mt-3">
                                            {logs.map((log, i) => <div key={i} className="flex gap-2"><span className="text-zinc-700">[{new Date().toLocaleTimeString()}]</span><span className="text-zinc-400">{log}</span></div>)}
                                        </div>
                                    )}
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
