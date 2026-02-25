// frontend/src/modules/spaces/ui/inspectors/SpaceCrewNodeInspector.tsx

import React, { useState } from "react";
import {
  CardBody,
  Tabs,
  Tab,
  Input,
  ScrollShadow,
  Button,
  Progress,
  Chip,
  Avatar,
  Select,
  SelectItem,
} from "@heroui/react";
import { 
  Terminal,
  Users,
  FileText,
  CheckCircle2,
  ChevronRight,
  Clock,
  AlertCircle,
  MessageSquare,
  Activity,
  Bot,
  ChevronUp,
  ChevronDown,
  Layers,
  Network,
  Link as LinkIcon,
  Search,
  Archive,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Plus
} from "lucide-react";
import { SpaceCrewInspectorProperties } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

const DETECTED_WORKSPACE_OUTPUTS = [
    { node: "User Researcher", artifact: "user_persona.json", type: "json" },
    { node: "Interview Synthesis", artifact: "competitors_list.csv", type: "csv" },
    { node: "Figma Sync", artifact: "design_assets.zip", type: "zip" },
    { node: "Brand Engine", artifact: "logo_primary.png", type: "image" },
    { node: "Copywriter Agent", artifact: "draft_v1.json", type: "json" },
];

export const SpaceCrewNodeInspector = ({ 
    data, 
    onPropertyChange
}: SpaceCrewInspectorProperties) => {
    const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [nodeSearch, setNodeSearch] = useState("");

    const isMissingContext = data.state === 'missing_context';
    const isWorking = data.state === 'working';
    const isConsultation = data.state === 'conversation';
    const isBriefing = data.state === 'briefing';
    const isDone = data.state === 'done';

    const tasks = data.tasks || [];
    const logs = data.execution_logs || [];
    
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const progressValue = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const processType = data.process_type || 'sequential';
    const managerTitle = data.manager_title || (processType === 'hierarchical' ? 'Manager' : undefined);

    const getPlanTitle = () => {
        if (processType === 'hierarchical') return "Plan adaptacyjny";
        if (processType === 'parallel') return "Plan informacyjny";
        return "Plan wiążący";
    };

    const consultationQuestions = data.consultation_questions || [];
    const allQuestionsAnswered = consultationQuestions.every(q => 
        (q.answer && q.answer.trim().length > 0) || 
        (consultationAnswers[q.id] && consultationAnswers[q.id].trim().length > 0)
    );

    const contextRequirements = data.context_requirements || [];
    const missingFields = contextRequirements.filter(r => !r.link && !r.sourceNodeLabel);
    const isContextComplete = contextRequirements.length === 0 || missingFields.length === 0;

    const transitionTo = (state: string, extraProps: Record<string, unknown> = {}) => {
        onPropertyChange({ state, ...extraProps });
    };

    const handleContextLinkChange = (contextId: string, link: string) => {
        const newContexts = contextRequirements.map(c => 
            c.id === contextId ? { ...c, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : c
        );
        onPropertyChange('context_requirements', newContexts);
    };

    const handleLinkContextFromNode = (contextId: string, nodeLabel: string, artifactLabel: string) => {
        const newContexts = contextRequirements.map(c => 
            c.id === contextId 
                ? { ...c, link: `node://${nodeLabel}/${artifactLabel}`, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel } 
                : c
        );
        onPropertyChange('context_requirements', newContexts);
    };

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Crew Inspector" 
                size="sm" 
                variant="underlined"
                classNames={{
                    base: "w-full border-b border-zinc-800",
                    tabList: "px-6 w-full gap-6",
                    cursor: "w-full bg-zinc-200 h-[2px]",
                    tab: "max-w-fit px-0 h-12 text-[10px] font-black uppercase tracking-widest text-zinc-500 data-[selected=true]:text-white",
                    tabContent: "group-data-[selected=true]:text-white transition-colors"
                }}
            >
                {/* --- MAIN TEAM WORKFLOW TAB --- */}
                <Tab key="orchestration" title={<div className="flex items-center gap-2"><Users size={12}/> Team</div>}>
                    <ScrollShadow className="p-8 h-[calc(100vh-220px)]">
                        <div className="space-y-10">
                            
                            {/* PHASE: MISSING CONTEXT */}
                            {isMissingContext && (
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                            <div className="p-2 rounded-lg bg-zinc-800 text-blue-400">
                                                {managerTitle ? <ShieldCheck size={16} /> : <AlertCircle size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">{managerTitle || 'Note'}</p>
                                                <p className="text-[9px] text-zinc-500 font-bold leading-relaxed">
                                                    Uzupełnij wymagany Context. {managerTitle || data.label} potrzebuje tych danych, aby {processType === 'sequential' ? 'wykonać sekwencję' : 'stworzyć Plan'}.
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="space-y-3">
                                            <Button 
                                                size="sm" 
                                                isDisabled={!isContextComplete}
                                                className={cn(
                                                    "w-full font-black uppercase text-[10px] tracking-widest rounded-md transition-all border h-12 shadow-xl shadow-white/5",
                                                    isContextComplete 
                                                        ? "bg-zinc-200 text-black border-white hover:bg-white" 
                                                        : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"
                                                )}
                                                onPress={() => transitionTo('briefing')}
                                            >
                                                {isContextComplete ? "Wygeneruj Plan (Briefing)" : `Missing ${missingFields.length} context fields`}
                                            </Button>
                                            
                                            {processType === 'sequential' && (
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="flat" isDisabled className="flex-1 text-[9px] font-black uppercase bg-zinc-900 border border-zinc-800 text-zinc-600">Zatwierdź kolejkę</Button>
                                                    <Button size="sm" variant="flat" isDisabled className="flex-1 text-[9px] font-black uppercase bg-zinc-900 border border-zinc-800 text-zinc-600">Edytuj Cele</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Proposed Sequence</h4>
                                        <div className="space-y-2.5">
                                            {data.roles.map((role, i) => (
                                                <div key={i} className="flex items-center gap-3 px-4 py-3 bg-zinc-900/20 border border-zinc-800/50 rounded-xl">
                                                    <span className="text-[10px] font-mono text-zinc-600">{i+1}.</span>
                                                    <span className="text-[11px] font-bold text-zinc-400">{role}</span>
                                                    <span className="ml-auto text-[8px] font-black text-zinc-700 uppercase tracking-tighter">Zadanie (Goal)</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PHASE: BRIEFING */}
                            {isBriefing && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-black text-white tracking-tight">{getPlanTitle()}</h3>
                                        <Chip size="sm" variant="flat" className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-black uppercase tracking-widest px-2">Ready</Chip>
                                    </div>

                                    <div className="space-y-4">
                                        {tasks.map((task, i) => (
                                            <div key={task.id} className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-4 h-4 rounded border border-zinc-700 flex items-center justify-center bg-black">
                                                        {task.status === 'done' && <CheckCircle2 size={10} className="text-zinc-500" />}
                                                    </div>
                                                    <span className="text-[11px] font-black text-zinc-200">{task.assignedAgentTitle}</span>
                                                </div>
                                                <p className="text-[10px] text-zinc-500 font-mono pl-6 leading-relaxed italic">
                                                    Zadanie: &quot;{task.label}&quot;
                                                </p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-4 border-t border-zinc-900 space-y-6">
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Szacowany Koszt:</span>
                                            <span className="text-[10px] font-mono text-zinc-300">~ {data.metrics?.tokens || '8k'} tokenów (ok. ${data.metrics?.cost || '0.50'})</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button 
                                                size="sm" 
                                                className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all h-10 shadow-xl shadow-white/5"
                                                onPress={() => transitionTo('working')}
                                            >
                                                Tak, Zaczynaj
                                            </Button>
                                            <Button 
                                                size="sm" 
                                                variant="flat" 
                                                className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-zinc-800 transition-all h-10"
                                                onPress={() => transitionTo('missing_context')}
                                            >
                                                Zmień Plan
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PHASE: WORKING (Live Hierarchy / Thoughts) */}
                            {isWorking && (
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                            <Zap size={12} className="text-blue-400 animate-pulse" /> Live Hierarchy / Thoughts
                                        </h3>
                                        <span className="text-[10px] font-mono text-white animate-pulse">{progressValue}%</span>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Manager Thought if Hierarchical */}
                                        {processType === 'hierarchical' && (
                                            <div className="pl-4 border-l-2 border-blue-500/30 space-y-2">
                                                <p className="text-[11px] font-black text-blue-400 uppercase tracking-tighter">{managerTitle}</p>
                                                <p className="text-[10px] text-zinc-300 font-mono leading-relaxed bg-blue-500/5 p-3 rounded-lg border border-blue-500/10 italic">
                                                    &quot;Czekam na dane od analityków i nadzoruję proces...&quot;
                                                </p>
                                            </div>
                                        )}

                                        {tasks.map((task, i) => (
                                            <div key={task.id} className={cn(
                                                "pl-4 border-l-2 space-y-2 transition-all duration-500",
                                                task.status === 'working' ? "border-zinc-200 animate-pulse" : "border-zinc-800"
                                            )}>
                                                <div className="flex items-center justify-between">
                                                    <span className={cn("text-[11px] font-black uppercase tracking-tighter", task.status === 'working' ? "text-white" : "text-zinc-600")}>
                                                        {i+1}. {task.assignedAgentTitle}
                                                    </span>
                                                    <span className={cn("text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded", 
                                                        task.status === 'done' ? "bg-green-500/10 text-green-500" : 
                                                        task.status === 'working' ? "bg-blue-500/10 text-blue-400" : "bg-zinc-900 text-zinc-700")}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                                {task.status !== 'pending' && (
                                                    <p className="text-[10px] text-zinc-400 font-mono leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50 italic">
                                                        &quot;{task.thought || (task.status === 'done' ? 'Task completed successfully.' : 'Processing and thinking...')}&quot;
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-red-950/20 hover:text-red-500 hover:border-red-900 transition-all h-10 mt-10"
                                        onPress={() => transitionTo('conversation')}
                                    >
                                        Zatrzymaj pracę
                                    </Button>
                                </div>
                            )}

                            {/* PHASE: DONE */}
                            {isDone && (
                                <div className="space-y-8 animate-in fade-in duration-500">
                                    <div className="flex items-center gap-3 py-4 border-b border-zinc-900">
                                        <div className="p-3 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 shadow-lg shadow-green-500/5">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-black text-white tracking-tight uppercase">Twoje artefakty są gotowe</h3>
                                            <p className="text-[10px] text-zinc-500 font-bold">Wszystkie zadania zespołu zostały zrealizowane.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Szczegóły:</h4>
                                        <div className="text-[10px] text-zinc-400 space-y-2.5 font-mono bg-zinc-900/20 p-4 rounded-2xl border border-zinc-800">
                                            <p className="flex justify-between"><span className="text-zinc-600">Model:</span> <span className="text-zinc-300">Hybrid Crew (GPT-4o + Claude 3.5)</span></p>
                                            <p className="flex justify-between"><span className="text-zinc-600">Czas:</span> <span className="text-zinc-300">{data.metrics?.duration || '4 min 12s'}</span></p>
                                            <p className="flex justify-between"><span className="text-zinc-600">Zużycie:</span> <span className="text-zinc-300">~ {data.metrics?.tokens || '6,800'} tokenów</span></p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <Button 
                                            size="sm" 
                                            className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all h-10 shadow-xl shadow-white/5"
                                            onPress={() => transitionTo('missing_context', { progress: 0 })}
                                        >
                                            Nowe zadanie
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="flat" 
                                            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-zinc-800 transition-all h-10"
                                        >
                                            Historia Wersji
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Execution Logs Toggle (Always available at bottom if working/done) */}
                            {!isMissingContext && logs.length > 0 && (
                                <div className="pt-4 border-t border-zinc-900">
                                    <button 
                                        onClick={() => setIsLogsOpen(!isLogsOpen)}
                                        className="flex items-center justify-between w-full group py-1"
                                    >
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors flex items-center gap-2">
                                            <Terminal size={12} /> Orchestration Logs
                                        </h4>
                                        {isLogsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                    </button>
                                    
                                    {isLogsOpen && (
                                        <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-900 font-mono text-[10px] space-y-2 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                            {logs.map((log, i) => (
                                                <div key={i} className="flex gap-2">
                                                    <span className="text-zinc-700 shrink-0">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                                                    <span className="text-zinc-400">{log}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>

                {/* --- CONTEXT TAB (Detailed Editing) --- */}
                <Tab
                    key="context"
                    title={
                        <div className="flex items-center gap-2">
                            <Layers size={12} />
                            Context
                            {isContextComplete && contextRequirements.length > 0 && (
                                <CheckCircle2 size={10} className="text-green-500" />
                            )}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-10">
                            {contextRequirements.map((context) => {
                                const compatibleOutputs = DETECTED_WORKSPACE_OUTPUTS.filter(out =>
                                    (!context.expectedType ||
                                    context.expectedType === 'any' ||
                                    out.type === context.expectedType) &&
                                    (out.node.toLowerCase().includes(nodeSearch.toLowerCase()) || 
                                     out.artifact.toLowerCase().includes(nodeSearch.toLowerCase()))
                                );

                                const isMissing = !context.link && !context.sourceNodeLabel;
                                const formatLabel = context.expectedType ? `[ ${context.expectedType.toUpperCase()} ]` : '[ Text ]';

                                return (
                                    <div key={context.id} className="space-y-3.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className={cn("text-xs font-black tracking-tight", isMissing ? "text-red-500" : "text-white")}>
                                                    {context.label} <span className="text-[9px] text-zinc-500 font-mono ml-1">{formatLabel}</span>
                                                </h4>
                                            </div>
                                            <div className={cn(
                                                "text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-widest",
                                                isMissing ? "bg-red-500/10 text-red-500 border border-red-500/20" : "bg-green-500/10 text-green-500 border border-green-500/20"
                                            )}>
                                                {isMissing ? "MISSING" : "OK"}
                                            </div>
                                        </div>

                                        {context.sourceNodeLabel ? (
                                            <div className="p-3 bg-zinc-900/50 border border-zinc-200/20 rounded-xl flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                                    <Network size={14} />
                                                </div>
                                                <div className="flex flex-col flex-1 min-w-0">
                                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Linked from Node</span>
                                                    <span className="text-[10px] font-black text-zinc-200 truncate">{context.sourceNodeLabel}</span>
                                                    <span className="text-[9px] font-bold text-zinc-500 font-mono truncate">{context.sourceArtifactLabel}</span>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="light"
                                                    className="min-w-0 h-8 px-2 text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                                                    onPress={() => handleContextLinkChange(context.id, "")}
                                                >
                                                    Clear
                                                </Button>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    size="sm"
                                                    variant="bordered"
                                                    placeholder="Paste link or link from node..."
                                                    value={context.link || ""}
                                                    onValueChange={(value) => handleContextLinkChange(context.id, value)}
                                                    startContent={<LinkIcon size={12} className={cn(isMissing ? "text-red-500/50" : "text-zinc-500")} />}
                                                    classNames={{
                                                        input: "text-[10px] font-bold text-zinc-200",
                                                        inputWrapper: cn(
                                                            "h-10 rounded-lg bg-zinc-900/30 transition-colors shadow-none",
                                                            isMissing ? "border-red-900/50 hover:border-red-500" : "border-zinc-800 hover:border-zinc-700"
                                                        ),
                                                    }}
                                                />

                                                <div className="flex justify-start">
                                                    <Select
                                                        size="sm"
                                                        variant="flat"
                                                        aria-label="Node Outputs"
                                                        placeholder="Link from Node Output"
                                                        selectedKeys={[]}
                                                        isDisabled={compatibleOutputs.length === 0 && nodeSearch === ""}
                                                        onSelectionChange={(keys) => {
                                                            const key = Array.from(keys)[0];
                                                            if (key !== undefined) {
                                                                const source = compatibleOutputs[Number(key)];
                                                                if (source) {
                                                                    handleLinkContextFromNode(context.id, source.node, source.artifact);
                                                                }
                                                            }
                                                        }}
                                                        onOpenChange={(isOpen) => !isOpen && setNodeSearch("")}
                                                        classNames={{
                                                            base: "w-full max-w-[260px]",
                                                            trigger: cn(
                                                                "h-9 font-black uppercase tracking-widest text-[10px] rounded-lg shadow-none transition-all",
                                                                isMissing 
                                                                    ? "bg-red-950/10 text-red-500/70 border border-red-900/30 hover:border-red-500" 
                                                                    : "bg-zinc-900/50 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                                                            ),
                                                            value: "text-zinc-400 font-black uppercase tracking-widest text-[10px]",
                                                            popoverContent: "bg-zinc-950 border border-zinc-800 rounded-xl p-0 shadow-2xl",
                                                            listbox: "p-2",
                                                        }}
                                                        renderValue={() => (
                                                            <div className="flex items-center gap-2.5">
                                                                <Network size={14} className={isMissing ? "text-red-500/50" : "text-zinc-500"} />
                                                                <span>Link from Node Output</span>
                                                            </div>
                                                        )}
                                                        listboxProps={{
                                                            topContent: (
                                                                <div className="px-1 py-2 border-b border-zinc-900 mb-1">
                                                                    <Input
                                                                        size="sm"
                                                                        placeholder="Search node or artifact..."
                                                                        value={nodeSearch}
                                                                        onChange={(e) => setNodeSearch(e.target.value)}
                                                                        onKeyDown={(e) => {
                                                                            if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter" && e.key !== "Escape") {
                                                                                e.stopPropagation();
                                                                            }
                                                                        }}
                                                                        startContent={<Search size={14} className="text-zinc-600" />}
                                                                        classNames={{
                                                                            input: "text-zinc-300 text-[11px] font-bold",
                                                                            inputWrapper: "h-9 bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors",
                                                                        }}
                                                                    />
                                                                </div>
                                                            )
                                                        }}
                                                    >
                                                        {compatibleOutputs.length > 0 ? (
                                                            compatibleOutputs.map((source, index) => (
                                                                <SelectItem 
                                                                    key={index} 
                                                                    textValue={source.node}
                                                                    className="data-[hover=true]:bg-zinc-900/80 rounded-lg py-2.5 px-3"
                                                                >
                                                                    <div className="flex flex-col gap-1">
                                                                        <div className="flex items-center justify-between gap-4">
                                                                            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-200">
                                                                                {source.node}
                                                                            </span>
                                                                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-zinc-900 text-zinc-600 rounded border border-zinc-800 uppercase tracking-tighter shrink-0">
                                                                                {source.type}
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-1.5">
                                                                            <Archive size={10} className="text-zinc-600" />
                                                                            <span className="text-[10px] font-bold text-zinc-500 font-mono truncate">
                                                                                {source.artifact}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </SelectItem>
                                                            ))
                                                        ) : (
                                                            <SelectItem key="none" isReadOnly className="text-[10px] font-black uppercase tracking-widest text-zinc-700 text-center py-6 italic">
                                                                No matching outputs
                                                            </SelectItem>
                                                        )}
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </ScrollShadow>
                </Tab>

                {/* --- ARTEFACTS TAB (Detailed) --- */}
                <Tab key="artefacts" title={<div className="flex items-center gap-2"><FileText size={12}/> Artefacts</div>}>
                    <ScrollShadow className="p-8 h-[calc(100vh-220px)]">
                        <div className="space-y-4">
                            {data.artefacts?.map((art) => (
                                <div key={art.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                            <FileText size={14} />
                                        </div>
                                        <span className="text-xs font-black text-white">{art.label}</span>
                                    </div>
                                    <Button size="sm" variant="light" isIconOnly className="text-zinc-500 hover:text-white">
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            ))}
                            {(!data.artefacts || data.artefacts.length === 0) && (
                                <div className="text-center py-20 opacity-30">
                                    <FileText size={32} className="mx-auto mb-4 text-zinc-700" />
                                    <p className="text-[10px] font-black uppercase tracking-widest">No artefacts yet</p>
                                </div>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
