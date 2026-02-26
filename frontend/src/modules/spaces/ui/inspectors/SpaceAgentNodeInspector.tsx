// frontend/src/modules/spaces/ui/inspectors/SpaceAgentNodeInspector.tsx

import React, { useState } from "react";
import {
  CardBody,
  Tabs,
  Tab,
  Input,
  ScrollShadow,
  Button,
  Progress,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Select,
  SelectItem,
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot,
  Layers,
  FileText,
  CheckCircle2,
  ChevronRight,
  Link as LinkIcon,
  Archive,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  ArrowUpRight,
  Search,
  Network,
  History,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { SpaceAgentInspectorProperties, TemplateArtefact, TemplateContext } from "../../domain/types";
import { cn } from "@/shared/lib/utils";

const ARTEFACT_STATUS_CONFIG = {
    in_review: { label: "In Review", color: "text-blue-400", dot: "bg-blue-400", icon: Clock },
    approved: { label: "Approved", color: "text-green-500", dot: "bg-green-500", icon: CheckCircle },
} as const;

const DETECTED_WORKSPACE_OUTPUTS = [
    { node: "User Researcher", artifact: "user_persona.json", type: "json" },
    { node: "Interview Synthesis", artifact: "competitors_list.csv", type: "csv" },
    { node: "Figma Sync", artifact: "design_assets.zip", type: "zip" },
    { node: "Brand Engine", artifact: "logo_primary.png", type: "image" },
    { node: "Copywriter Agent", artifact: "draft_v1.json", type: "json" },
];

export const SpaceAgentNodeInspector = ({ 
    data, 
    nodeId,
    onStatusChange,
    onPropertyChange
}: SpaceAgentInspectorProperties) => {
    const [nodeSearch, setNodeSearch] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
    const [expandedVersionHistory, setExpandedVersions] = useState<Record<string, boolean>>({});

    const isMissingContext = data.state === 'missing_context';
    const isBriefing = data.state === 'briefing';
    const isWorking = data.state === 'working';
    const isDone = data.state === 'done';
    const isConsultation = data.state === 'conversation';
    const isAlignment = data.state === 'alignment';
    const isCritique = data.state === 'critique';

    // Mock predefined questions if consultation is required but questions are empty
    const consultationQuestions = data.consultation_questions || (data.requires_consultation ? [
        { id: 'q1', question: 'Do kogo kierujemy ten komunikat? (B2B/B2C)' },
        { id: 'q2', question: 'Jaki jest główny cel tego zadania?' },
        { id: 'q3', question: 'Czy są jakieś specyficzne wytyczne co do stylu?' },
    ] : []);

    const allQuestionsAnswered = consultationQuestions.every(q => 
        (q.answer && q.answer.trim().length > 0) || 
        (consultationAnswers[q.id] && consultationAnswers[q.id].trim().length > 0)
    );

    // Simulation of dynamic working process using TanStack Query
    useQuery({
        queryKey: ["agent-worker", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && data.progress < 100) {
                const nextProgress = Math.min(data.progress + 2, 100);
                const nextTokens = (data.metrics?.tokens || 3200) + Math.floor(Math.random() * 50);
                
                let nextState = 'working';
                if (nextProgress >= 90 && data.requires_critique) {
                    nextState = 'critique';
                } else if (nextProgress === 100) {
                    nextState = 'done';
                }

                onPropertyChange({ 
                    progress: nextProgress,
                    metrics: {
                        ...data.metrics,
                        tokens: nextTokens,
                    },
                    state: nextState
                });
                return nextProgress;
            }
            return data.progress;
        },
        refetchInterval: isWorking && data.progress < 100 ? 1000 : false,
        enabled: isWorking && data.progress < 100,
    });

    // Context validation logic
    const contextRequirements: readonly TemplateContext[] = data.context_requirements || [
        { id: '1', label: 'topic', expectedType: 'any' },
        { id: '2', label: 'target_audience', expectedType: 'json' },
        { id: '3', label: 'tone_of_voice', expectedType: 'any' }
    ];
    const missingFields = contextRequirements.filter(r => !r.link);
    const isContextComplete = missingFields.length === 0;

    // Working phase dynamic data
    const workingLogs = [
        { threshold: 0, label: 'Przygotowanie struktury' },
        { threshold: 20, label: 'Analiza dostarczonych danych' },
        { threshold: 45, label: 'Generowanie treści merytorycznej' },
        { threshold: 70, label: 'Syntetyzowanie wniosków' },
        { threshold: 90, label: 'Finalizacja dokumentu' },
    ];
    const currentTask = [...workingLogs].reverse().find(l => data.progress >= l.threshold)?.label || "Inicjalizacja...";
    
    // Dynamic metrics calculated from progress
    const simulatedTokens = data.metrics?.tokens || Math.floor((data.progress / 100) * 7000);
    const elapsedSeconds = Math.floor((data.progress / 100) * 120);
    const remainingSeconds = Math.floor(((100 - data.progress) / 100) * 120);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m} min ${sec} s`;
    };

    const getCurrentArtefacts = () => data.artefacts || [
        { id: '1', label: 'article.md', status: 'approved', link: 'https://axon.ai/docs/article_v1.md' }
    ];

    const transitionTo = (state: string, extraProps: Record<string, unknown> = {}) => {
        onPropertyChange({ state, ...extraProps });
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setConsultationAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const submitConsultation = () => {
        const updatedQuestions = consultationQuestions.map(q => ({
            ...q,
            answer: consultationAnswers[q.id] || q.answer
        }));
        
        // After consultation, go to Alignment if required, else Briefing
        const nextState = data.requires_alignment ? 'alignment' : 'briefing';

        transitionTo(nextState, { 
            consultation_questions: updatedQuestions,
            alignment_summary: data.requires_alignment ? "Z Twoich danych wywnioskowałem, że najważniejszym priorytetem jest optymalizacja procesów B2B, powinniśmy unikać terminologii technicznej, a głównym konkurentem jest Salesforce. Będę pisał w tonie eksperckim, ale przystępnym." : undefined,
            execution_logs: [
                ...(data.execution_logs || []),
                ...updatedQuestions.map(q => `Consultation: ${q.question} -> ${q.answer}`)
            ]
        });
    };

    const toggleVersionHistory = (id: string) => {
        setExpandedVersions(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleRestoreVersion = (artefactId: string, versionLabel: string) => {
        const newArtefacts = getCurrentArtefacts().map(a => 
            a.id === artefactId ? { ...a, label: `article_${versionLabel.toLowerCase()}.md`, status: 'in_review' as const } : a
        );
        onPropertyChange('artefacts', newArtefacts);
        // Collapse after restore for feedback
        toggleVersionHistory(artefactId);
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

    const handleArtefactStatusChange = (artefactId: string, status: TemplateArtefact['status']) => {
        const newArtefacts = getCurrentArtefacts().map(a => 
            a.id === artefactId ? { ...a, status } : a
        );
        onPropertyChange('artefacts', newArtefacts);
    };

    const handleArtefactOutputToggle = (artefactId: string) => {
        const newArtefacts = getCurrentArtefacts().map(a => 
            a.id === artefactId ? { ...a, isOutput: !a.isOutput } : a
        );
        onPropertyChange('artefacts', newArtefacts);
    };

    return (
        <CardBody className="p-0 flex flex-col h-full bg-black">
            <Tabs 
                aria-label="Inspector" 
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
                <Tab key="agent" title={<div className="flex items-center gap-2"><Bot size={12}/> Agent</div>}>
                    <ScrollShadow className="p-8 h-[calc(100vh-220px)]">
                        {isMissingContext && (
                            <div className="space-y-6">
                                <Button 
                                    size="sm" 
                                    isDisabled={!isContextComplete}
                                    className={cn(
                                        "w-full font-black uppercase text-[10px] tracking-widest rounded-md transition-all border",
                                        isContextComplete 
                                            ? "bg-zinc-200 text-black border-white hover:bg-white" 
                                            : "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed"
                                    )}
                                    onPress={() => {
                                        if (data.requires_consultation) {
                                            transitionTo('conversation');
                                        } else if (data.requires_alignment) {
                                            transitionTo('alignment', { alignment_summary: "Zanalizowałem dostarczone dane. Moim celem jest przygotowanie raportu zorientowanego na wyniki, biorąc pod uwagę ograniczenia budżetowe oraz specyfikę branży kreatywnej." });
                                        } else {
                                            transitionTo('briefing');
                                        }
                                    }}
                                >
                                    {isContextComplete ? "Prepare Briefing" : `Missing ${missingFields.length} context fields`}
                                </Button>

                                <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <AlertCircle size={12} />
                                        <h3 className="text-[9px] font-black uppercase tracking-widest">Agent Goal</h3>
                                    </div>
                                    <p className="text-[10px] text-zinc-400 font-medium italic leading-relaxed">
                                        {isContextComplete 
                                            ? data.requires_consultation 
                                                ? "Context complete. Consultation required before planning."
                                                : "Wszystkie dane są gotowe. Możemy przygotować briefing i rozpocząć generowanie treści." 
                                            : `Aby Agent mógł pracować, uzupełnij wymagane parametry w zakładce Context: ${missingFields.map(f => f.label).join(', ')}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {isConsultation && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 py-1">
                                    <AlertCircle size={14} className="text-zinc-400" />
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Consultation Required</h3>
                                </div>

                                <div className="space-y-5">
                                    {consultationQuestions.map((q) => (
                                        <div key={q.id} className="space-y-2.5">
                                            <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">
                                                {q.question}
                                            </p>
                                            <Input 
                                                placeholder="Type your answer..." 
                                                size="sm" 
                                                variant="bordered"
                                                value={consultationAnswers[q.id] || q.answer || ""}
                                                onValueChange={(val) => handleAnswerChange(q.id, val)}
                                                classNames={{ 
                                                    input: "text-xs font-mono text-zinc-300", 
                                                    inputWrapper: "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700 focus-within:!border-zinc-200 rounded-lg h-10 shadow-none" 
                                                }} 
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button 
                                    size="sm" 
                                    isDisabled={!allQuestionsAnswered}
                                    className={cn(
                                        "w-full font-black uppercase text-[10px] tracking-widest rounded-md transition-all mt-4",
                                        allQuestionsAnswered 
                                            ? "bg-zinc-200 text-black hover:bg-white" 
                                            : "bg-zinc-900 text-zinc-600 border border-zinc-800 cursor-not-allowed"
                                    )}
                                    onPress={submitConsultation}
                                >
                                    {allQuestionsAnswered ? "Send responses" : "Answer all questions"}
                                </Button>
                            </div>
                        )}

                        {isAlignment && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 py-1 text-zinc-400">
                                    <ShieldCheck size={14} />
                                    <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Alignment / Understanding Check</h3>
                                </div>

                                <div className="p-5 bg-zinc-900/50 border border-zinc-200/10 rounded-xl space-y-3">
                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Agent understanding:</span>
                                    <p className="text-xs text-zinc-300 font-mono leading-relaxed italic">
                                        &quot;{data.alignment_summary}&quot;
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Button 
                                        size="sm" 
                                        className="w-full bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all"
                                        onPress={() => transitionTo('briefing')}
                                    >
                                        Looks correct, proceed to plan
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-zinc-800 transition-all"
                                        onPress={() => transitionTo('conversation')}
                                    >
                                        Adjust assumptions
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isBriefing && (
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plan pracy:</h4>
                                    <div className="space-y-2">
                                        {(data.plan_steps || [
                                            { id: '1', label: 'Wczytam i oczyszczę Twoje dane.', status: 'pending' },
                                            { id: '2', label: 'Przeszukam rekordy w poszukiwaniu nietypowych wzorców.', status: 'pending' },
                                            { id: '3', label: 'Zapiszę rekomendacje co zrobić z wynikami.', status: 'pending' }
                                        ]).map((step) => (
                                            <div key={step.id} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                                <span className="text-[11px] text-zinc-300 font-mono">Krok {step.id}: {step.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-zinc-900">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Koszt:</span>
                                        <span className="text-[10px] font-mono text-zinc-300">~ {data.metrics?.tokens || '8k'} tokenów (ok. ${data.metrics?.cost || '0.50'})</span>
                                    </div>
                                    <div className="flex gap-3">
                                        <Button 
                                            size="sm" 
                                            className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all"
                                            onPress={() => transitionTo('working', { progress: 5 })}
                                        >
                                            Tak, Zaczynaj
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            variant="flat" 
                                            className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-zinc-800 transition-all"
                                            onPress={() => transitionTo('missing_context')}
                                        >
                                            Zmień Plan
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isWorking && (
                            <div className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-end">
                                        <p className="text-[10px] text-zinc-200 font-medium tracking-tight animate-pulse">
                                            {currentTask}
                                        </p>
                                        <span className="text-[10px] font-mono text-white">{data.progress}%</span>
                                    </div>
                                    <Progress 
                                        size="sm" 
                                        value={data.progress} 
                                        classNames={{ 
                                            indicator: "bg-zinc-200 transition-all duration-1000", 
                                            base: "bg-zinc-900 h-2 rounded-full" 
                                        }} 
                                    />
                                </div>
                                <div className="pt-4 border-t border-zinc-900">
                                    <button 
                                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                        className="flex items-center justify-between w-full group py-1"
                                    >
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Szczegóły:</h4>
                                        {isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                    </button>
                                    
                                    {isDetailsOpen && (
                                        <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="space-y-1.5">
                                                {workingLogs.map((log, i) => {
                                                    const isLogDone = data.progress > log.threshold;
                                                    const isLogCurrent = data.progress >= log.threshold && (i === workingLogs.length - 1 || data.progress < workingLogs[i+1].threshold);
                                                    return (
                                                        <div key={i} className={cn(
                                                            "text-[10px] font-mono flex gap-2",
                                                            isLogDone ? "text-zinc-400" : isLogCurrent ? "text-zinc-100" : "text-zinc-700 opacity-50"
                                                        )}>
                                                            <span className={cn("font-bold", isLogDone ? "text-zinc-600" : isLogCurrent ? "text-zinc-200" : "text-zinc-800")}>
                                                                {isLogDone ? "[Done]" : isLogCurrent ? "[Processing]" : "[Pending]"}
                                                            </span> 
                                                            {log.label}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="space-y-1 pt-3 border-t border-zinc-900/50">
                                                <div className="flex justify-between text-[10px] font-mono">
                                                    <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Zużyto:</span>
                                                    <span className="text-zinc-200 tabular-nums">{simulatedTokens.toLocaleString()} tokenów</span>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-mono">
                                                    <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Szacowane:</span>
                                                    <span className="text-zinc-400">~ 7,000 total</span>
                                                </div>
                                                <div className="flex justify-between text-[10px] font-mono pt-1">
                                                    <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Czas:</span>
                                                    <span className="text-zinc-500 italic">Minęło: {formatTime(elapsedSeconds)} | Pozostało: ~{formatTime(remainingSeconds)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <Button 
                                    size="sm" 
                                    variant="flat" 
                                    className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-red-950/20 hover:text-red-500 hover:border-red-900 transition-all"
                                    onPress={() => transitionTo('conversation')}
                                >
                                    Zatrzymaj pracę
                                </Button>
                            </div>
                        )}

                        {isCritique && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 py-1 text-zinc-400">
                                    <Zap size={14} className="text-orange-500 animate-pulse" />
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
                                        ].map((note, idx) => (
                                            <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                                                <div className="w-1 h-1 rounded-full bg-orange-500 animate-ping" />
                                                <span className="text-[10px] font-mono text-zinc-300">{note}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button 
                                        size="sm" 
                                        className="w-full bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all shadow-xl shadow-white/5"
                                        onPress={() => transitionTo('done', { progress: 100 })}
                                    >
                                        Finalize output
                                    </Button>
                                </div>
                            </div>
                        )}

                        {isDone && (
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-zinc-200">
                                    <CheckCircle2 size={16} className="text-green-500" />
                                    <h3 className="text-xs font-black uppercase tracking-widest">Twój tekst jest gotowy</h3>
                                </div>
                                <div className="pt-4 border-t border-zinc-900">
                                    <button 
                                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                                        className="flex items-center justify-between w-full group py-1"
                                    >
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest group-hover:text-zinc-300 transition-colors">Szczegóły:</h4>
                                        {isDetailsOpen ? <ChevronUp size={12} className="text-zinc-600" /> : <ChevronDown size={12} className="text-zinc-600" />}
                                    </button>
                                    
                                    {isDetailsOpen && (
                                        <div className="space-y-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                            <div className="text-[10px] text-zinc-400 space-y-1 font-mono">
                                                <p>• Artykuł akademicki o AI w edukacji</p>
                                                <p>• Ponad 2 tysiące słów</p>
                                                <p>• Przejrzysta struktura z nagłówkami</p>
                                                <div className="pt-2 text-zinc-600 font-bold uppercase">
                                                    Całkowity czas: {data.metrics?.duration || '4 min'} | Zużycie: {simulatedTokens.toLocaleString()} tokenów
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        size="sm" 
                                        className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-white transition-all"
                                        onPress={() => transitionTo('missing_context', { 
                                            progress: 0,
                                            metrics: { tokens: 0, duration: "0s" }
                                        })}
                                    >
                                        Nowe zadanie
                                    </Button>
                                    <Button 
                                        size="sm" 
                                        variant="flat" 
                                        className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-md hover:bg-zinc-800 transition-all"
                                    >
                                        Historia Wersji
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ScrollShadow>
                </Tab>

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
                                                                        </div>
                                
                                                                        {context.sourceNodeLabel ? (
                                                                            <div className="p-3 bg-zinc-900/50 border border-green-500/30 rounded-xl flex items-center gap-3">
                                                                                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400">
                                                                                    <Network size={14} />
                                                                                </div>
                                                                                <div className="flex flex-col flex-1 min-w-0">
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
                                                                                    endContent={!isMissing && <CheckCircle2 size={14} className="text-green-500/70" />}
                                                                                    classNames={{
                                                                                        input: "text-[10px] font-bold text-zinc-200",
                                                                                        inputWrapper: cn(
                                                                                            "h-10 rounded-lg bg-zinc-900/30 transition-colors shadow-none",
                                                                                            isMissing 
                                                                                                ? "border-red-900/50 hover:border-red-500" 
                                                                                                : "border-green-500/30 hover:border-green-500"
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
                            {(!data.context_requirements || data.context_requirements.length === 0) && (
                                <p className="text-xs text-zinc-600 italic text-center py-10">No context links required.</p>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>

                <Tab
                    key="artefacts"
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} />
                            Artefacts
                            {isDone && getCurrentArtefacts().every(a => a.status === 'approved') && (getCurrentArtefacts().length > 0) && (
                                <CheckCircle2 size={10} className="text-green-500" />
                            )}
                        </div>
                    }
                >
                    <ScrollShadow className="h-[calc(100vh-220px)] p-8">
                        <div className="space-y-10">
                            {/* Always show existing artefacts */}
                            {getCurrentArtefacts().map((art) => (
                                <div key={art.id} className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3.5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-xs font-black text-white tracking-tight">{art.label}</h4>
                                            {art.isOutput && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[8px] font-black text-orange-500 uppercase tracking-widest">
                                                    Output <ArrowUpRight size={8} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {art.link && (
                                                <a
                                                    href={art.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[9px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-1"
                                                >
                                                    Open <ExternalLink size={10} />
                                                </a>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex justify-start gap-1">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                <Button
                                                    size="sm"
                                                    variant="bordered"
                                                    className="h-10 border-zinc-800 bg-zinc-900/30 text-[9px] font-black uppercase tracking-widest min-w-32 justify-between"
                                                    endContent={<ChevronDown size={12} />}
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={cn("w-1.5 h-1.5 rounded-full", ARTEFACT_STATUS_CONFIG[art.status]?.dot || "bg-blue-400")} />
                                                        {ARTEFACT_STATUS_CONFIG[art.status]?.label || "In Review"}
                                                    </div>
                                                </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu
                                                aria-label="Artefact Status"
                                                onAction={(key) => handleArtefactStatusChange(art.id, key as TemplateArtefact['status'])}
                                                classNames={{
                                                    base: "bg-zinc-950 border border-zinc-800 p-1",
                                                }}
                                            >
                                                {(['in_review', 'approved'] as const).map((key) => (
                                                    <DropdownItem
                                                        key={key}
                                                        startContent={React.createElement(ARTEFACT_STATUS_CONFIG[key].icon, { size: 12, className: ARTEFACT_STATUS_CONFIG[key].color })}
                                                        className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
                                                    >
                                                        {ARTEFACT_STATUS_CONFIG[key].label}
                                                    </DropdownItem>
                                                ))}
                                            </DropdownMenu>
                                        </Dropdown>

                                        <Button
                                            isIconOnly
                                            size="sm"
                                            variant="bordered"
                                            isDisabled={art.status !== 'approved'}
                                            className={cn(
                                                "h-10 w-10 border-zinc-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
                                                art.isOutput ? "bg-orange-500/20 border-orange-500/50 text-orange-500" : "bg-zinc-900/30 text-zinc-600 hover:text-zinc-400"
                                            )}
                                            onPress={() => handleArtefactOutputToggle(art.id)}
                                            title={art.status === 'approved' ? "Mark as Workflow Output" : "Approve artefact to mark as output"}
                                        >
                                            <ArrowUpRight size={14} />
                                        </Button>
                                    </div>

                                    {/* Version History Toggle */}
                                    <div className="pt-2 border-t border-zinc-900/50 mt-2">
                                        <button 
                                            onClick={() => toggleVersionHistory(art.id)}
                                            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-colors"
                                        >
                                            <History size={10} />
                                            Version History
                                            {expandedVersionHistory[art.id] ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                                        </button>

                                        {expandedVersionHistory[art.id] && (
                                            <div className="mt-3 space-y-2 pl-2 border-l border-zinc-900 animate-in fade-in slide-in-from-left-1 duration-200">
                                                {[
                                                    { v: 'v2', date: 'Today, 14:20', tokens: '6,450' },
                                                    { v: 'v1', date: 'Yesterday, 18:05', tokens: '5,900' }
                                                ].map((ver, idx) => (
                                                    <div 
                                                        key={idx} 
                                                        className="flex items-center justify-between group/ver py-1.5 px-2 hover:bg-zinc-900/50 rounded-lg transition-all cursor-pointer"
                                                        onClick={() => handleRestoreVersion(art.id, ver.v)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-mono text-zinc-500">{ver.v}</span>
                                                            <div className="flex flex-col">
                                                                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-tight">{ver.date}</span>
                                                                <span className="text-[8px] font-mono text-zinc-600">{ver.tokens} tokens</span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 opacity-0 group-hover/ver:opacity-100 transition-opacity">
                                                            <div className="p-1 rounded bg-zinc-800 text-blue-400 hover:text-blue-300" title="Restore this version">
                                                                <RotateCcw size={10} />
                                                            </div>
                                                            <div className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white" title="View details">
                                                                <ExternalLink size={10} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {/* Show working animation as an addition, not a replacement */}
                            {isWorking && (
                                <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 border-dashed opacity-60">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <div className="p-2 rounded-lg bg-zinc-800 text-zinc-500 animate-pulse">
                                                <FileText size={14} />
                                            </div>
                                            <span className="text-xs font-black text-zinc-400">new_artefact.md</span>
                                        </div>
                                        <span className="text-[9px] text-zinc-200 font-black animate-pulse uppercase tracking-widest">Generating... {data.progress}%</span>
                                    </div>
                                </div>
                            )}

                            {/* Show empty placeholder ONLY if no artefacts AND not working */}
                            {(!isWorking && getCurrentArtefacts().length === 0) && (
                                <div className="text-center py-20 opacity-40">
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 rounded-full border-2 border-dashed border-zinc-700">
                                            <FileText size={32} className="text-zinc-700" />
                                        </div>
                                    </div>
                                    <p className="text-xs font-black uppercase tracking-widest text-zinc-600">No artefacts yet</p>
                                    <p className="text-[10px] text-zinc-700 mt-2 font-mono">Artefacts will appear here once the task is completed.</p>
                                </div>
                            )}
                        </div>
                    </ScrollShadow>
                </Tab>
            </Tabs>
        </CardBody>
    );
};
