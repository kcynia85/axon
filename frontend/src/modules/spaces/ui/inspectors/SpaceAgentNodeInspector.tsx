// frontend/src/modules/spaces/ui/inspectors/SpaceAgentNodeInspector.tsx

import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Input,
  ScrollShadow,
  Button,
  
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { 
  Bot,
  Layers,
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  ShieldCheck,
  Zap,
  CircleStop,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {  TemplateArtefact, TemplateContext } from "../../domain/types";
import { SpaceAgentInspectorProperties } from "../types";
import { cn } from "@/shared/lib/utils";
import { SpaceCrewContextTab } from "./crews/shared/SpaceCrewContextTab";
import { SpaceCrewArtefactsTab } from "./crews/shared/SpaceCrewArtefactsTab";
import { SpaceInspectorFooter } from "./components/SpaceInspectorFooter";
import { SpaceInspectorPanel } from "./components/SpaceInspectorPanel";


export const SpaceAgentNodeInspector = ({ 
    data, 
    nodeId,
    onPropertyChange
}: SpaceAgentInspectorProperties) => {
    const [nodeSearch, setNodeSearch] = useState("");
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);
    const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
    const [selectedTab, setSelectedTab] = useState<string>("agent");
    const [editingArtefactId, setEditingArtefactId] = useState<string | null>(null);
    const [expandedVersionHistory, setExpandedVersionHistory] = useState<Record<string, boolean>>({});

    const isMissingContext = data.state === 'missing_context';
    const isBriefing = data.state === 'briefing';
    const isWorking = data.state === 'working';
    const isDone = data.state === 'done';
    const isAborted = data.state === 'aborted';
    const isConsultation = data.state === 'conversation';
    const isAlignment = data.state === 'alignment';
    const isCritique = data.state === 'critique';

    const consultationQuestions = data.consultation_questions || (data.requires_consultation ? [
        { id: 'q1', question: 'Do kogo kierujemy ten komunikat? (B2B/B2C)' },
        { id: 'q2', question: 'Jaki jest główny cel tego zadania?' },
        { id: 'q3', question: 'Czy są jakieś specyficzne wytyczne co do stylu?' },
    ] : []);

    const allQuestionsAnswered = consultationQuestions.every(q => 
        (q.answer && q.answer.trim().length > 0) || 
        (consultationAnswers[q.id] && consultationAnswers[q.id].trim().length > 0)
    );

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
                onPropertyChange({ progress: nextProgress, metrics: { ...data.metrics, tokens: nextTokens }, state: nextState });
                return nextProgress;
            }
            return data.progress;
        },
        refetchInterval: isWorking && data.progress < 100 ? 1000 : false,
        enabled: isWorking && data.progress < 100,
    });

    const contextRequirements: readonly TemplateContext[] = data.context_requirements || [
        { id: '1', label: 'github_repo_url', expectedType: 'any' },
        { id: '2', label: 'deployment_target', expectedType: 'json' },
    ];
    const missingFields = contextRequirements.filter(r => !r.link);
    const isContextComplete = missingFields.length === 0;

    const workingLogs = [
        { threshold: 0, label: 'Przygotowanie struktury' },
        { threshold: 20, label: 'Analiza dostarczonych danych' },
        { threshold: 45, label: 'Generowanie treści merytorycznej' },
        { threshold: 70, label: 'Syntetyzowanie wniosków' },
        { threshold: 90, label: 'Finalizacja dokumentu' },
    ];
    
    const simulatedTokens = data.metrics?.tokens || Math.floor((data.progress / 100) * 7000);
    const elapsedSeconds = Math.floor((data.progress / 100) * 120);
    const remainingSeconds = Math.floor(((100 - data.progress) / 100) * 120);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m} min ${sec} s`;
    };

    const transitionTo = (state: string, extraProps: Record<string, unknown> = {}) => {
        onPropertyChange({ state, ...extraProps });
    };

    const handleAnswerChange = (questionId: string, answer: string) => {
        setConsultationAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const submitConsultation = () => {
        const updatedQuestions = consultationQuestions.map(q => ({ ...q, answer: consultationAnswers[q.id] || q.answer }));
        const nextState = data.requires_alignment ? 'alignment' : 'briefing';
        transitionTo(nextState, { 
            consultation_questions: updatedQuestions,
            alignment_summary: data.requires_alignment ? "Zanalizowałem dostarczone dane. Moim celem jest przygotowanie raportu zorientowanego na wyniki, biorąc pod uwagę ograniczenia budżetowe oraz specyfikę branży kreatywnej." : undefined,
        });
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

    // Fix: Robust mock data handling to prevent disappearing artefacts
    const getCurrentArtefacts = () => {
        if (data.artefacts && data.artefacts.length > 0) return data.artefacts;
        return [
            { id: 'art_1', label: 'initial_draft.md', status: 'in_review', link: 'https://axon.ai/docs/draft_v1.md' }
        ];
    };

    const handleArtefactStatusChange = (id: string, status: TemplateArtefact['status']) => {
        const current = getCurrentArtefacts();
        const next = current.map(a => a.id === id ? { ...a, status } : a);
        onPropertyChange('artefacts', next);
    };

    const handleArtefactOutputToggle = (id: string) => {
        const current = getCurrentArtefacts();
        const next = current.map(a => a.id === id ? { ...a, isOutput: !a.isOutput } : a);
        onPropertyChange('artefacts', next);
    };

    const handleArtefactContentChange = (id: string, content: string) => {
        const current = getCurrentArtefacts();
        const next = current.map(a => a.id === id ? { ...a, content } : a);
        onPropertyChange('artefacts', next);
    };

    const toggleVersionHistory = (id: string) => {
        setExpandedVersionHistory(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleRestoreVersion = (artefactId: string, versionLabel: string) => {
        const current = getCurrentArtefacts();
        const next = current.map(a => 
            a.id === artefactId ? { ...a, label: `article_${versionLabel.toLowerCase()}.md`, status: 'in_review' as const } : a
        );
        onPropertyChange('artefacts', next);
        toggleVersionHistory(artefactId);
    };

    const artefactsList = getCurrentArtefacts();
    const hasInReview = artefactsList.some(a => a.status === 'in_review');

    // Logic to find current task label based on progress
    const currentTaskLabel = workingLogs.find((log, i) => 
        data.progress >= log.threshold && (i === workingLogs.length - 1 || data.progress < workingLogs[i+1].threshold)
    )?.label;

    return (
        <SpaceInspectorPanel>
            <Tabs 
                aria-label="Inspector" 
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
                <Tab key="agent" title={<div className="flex items-center gap-2"><Bot size={12}/> Agent {isDone && <CheckCircle2 size={10} className="text-white"/>}</div>}>
                    <div className="h-[calc(100vh-192px)]">
                        <ScrollShadow className="p-8 h-full pb-48">
                            {(isMissingContext || isBriefing) && (
                                <div className="space-y-6">
                                    <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-2">
                                        <div className="flex items-center gap-2 text-zinc-500">
                                            <AlertCircle size={12} />
                                            <h3 className="text-[9px] font-black uppercase tracking-widest">Agent Goal</h3>
                                        </div>
                                        <p className="text-[10px] text-zinc-400 font-medium italic leading-relaxed">
                                            {isContextComplete 
                                                ? "Wszystkie dane są gotowe. Możemy przygotować briefing i rozpocząć generowanie treści." 
                                                : `Aby Agent mógł pracować, uzupełnij wymagane parametry w zakładce Context.`}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {isConsultation && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2 py-1 text-zinc-400">
                                        <AlertCircle size={14} />
                                        <h3 className="text-[10px] font-black text-white uppercase tracking-widest">Consultation Required</h3>
                                    </div>
                                    <div className="space-y-5">
                                        {consultationQuestions.map((q) => {
                                            const isAnswered = (consultationAnswers[q.id] || q.answer || "").trim().length > 0;
                                            return (
                                                <div key={q.id} className="space-y-2.5">
                                                    <p className="text-[11px] text-zinc-400 font-bold italic leading-relaxed">{q.question}</p>
                                                    <Input 
                                                        placeholder="Type your answer..." 
                                                        size="sm" 
                                                        variant="bordered"
                                                        value={consultationAnswers[q.id] || q.answer || ""}
                                                        onValueChange={(val) => handleAnswerChange(q.id, val)}
                                                        endContent={isAnswered && <CheckCircle2 size={14} className="text-white" />}
                                                        classNames={{ 
                                                            input: "text-xs font-mono text-zinc-300", 
                                                            inputWrapper: cn(
                                                                "h-11 bg-zinc-900/50 rounded-lg transition-all shadow-none border",
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
                                </div>
                            )}

                            {isBriefing && (
                                <div className="space-y-4">
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
                                    <div className="pt-4 border-t border-zinc-900">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Koszt:</span>
                                            <span className="text-[10px] font-mono text-zinc-300">~ {data.metrics?.tokens || '8k'} tokenów (ok. ${data.metrics?.cost || '0.50'})</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {isWorking && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-end min-h-[24px]">
                                            <div className="flex flex-col gap-1">
                                                <AnimatePresence mode="wait">
                                                    <motion.p 
                                                        key={currentTaskLabel}
                                                        initial={{ opacity: 0, y: 5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -5 }}
                                                        className="text-[11px] text-white font-bold text-shimmer"
                                                    >
                                                        {currentTaskLabel}
                                                    </motion.p>
                                                </AnimatePresence>
                                            </div>
                                            <span className="text-[10px] font-mono text-white">{data.progress}%</span>
                                        </div>
                                        <div className="relative h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                                            <motion.div 
                                                className="absolute inset-y-0 left-0 bg-white shadow-[0_0_10px_white]"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${data.progress}%` }}
                                                transition={{ type: "spring", stiffness: 50, damping: 20 }}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-zinc-900">
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
                                                    <div className="space-y-1.5">
                                                        {workingLogs.map((log, i) => {
                                                            const isLogDone = data.progress > log.threshold;
                                                            const isLogCurrent = data.progress >= log.threshold && (i === workingLogs.length - 1 || data.progress < workingLogs[i+1].threshold);
                                                            return (
                                                                <div key={i} className={cn(
                                                                    "text-[10px] font-mono flex gap-2",
                                                                    isLogDone ? "text-zinc-500" : isLogCurrent ? "text-white" : "text-zinc-700 opacity-50"
                                                                )}>
                                                                    <span className={cn("font-bold", isLogDone ? "text-zinc-600" : isLogCurrent ? "text-white" : "text-zinc-800")}>
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
                                                            <span className="text-zinc-300 tabular-nums" suppressHydrationWarning>{simulatedTokens.toLocaleString()} tokenów</span>
                                                        </div>
                                                        <div className="flex justify-between text-[10px] font-mono pt-1">
                                                            <span className="text-zinc-600 uppercase font-black text-[9px] tracking-tighter">Czas:</span>
                                                            <span className="text-zinc-500 italic">Minęło: {formatTime(elapsedSeconds)} | Pozostało: ~{formatTime(remainingSeconds)}</span>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )}

                            {isCritique && (
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
                                            ].map((note, idx) => (
                                                <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                                                    <div className="w-1 h-1 rounded-full bg-white animate-ping" />
                                                    <span className="text-[10px] font-mono text-zinc-300">{note}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
                                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">{isDone ? "Twój agent przygotował materiały do przeglądu." : "Zakończyliśmy zadanie przed czasem."}</p>
                                        </div>
                                    </motion.div>
                                    
                                    <div className="pt-4 border-t border-zinc-900">
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
                                                        <p>• Artykuł akademicki o AI w edukacji</p>
                                                        <p>• Ponad 2 tysiące słów</p>
                                                        <p>• Przejrzysta struktura z nagłówkami</p>
                                                        <div className="pt-2 text-zinc-600 font-bold uppercase" suppressHydrationWarning>
                                                            Całkowity czas: {data.metrics?.duration || '4 min'} | Zużycie: {simulatedTokens.toLocaleString()} tokenów
                                                        </div>
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
                            {isContextComplete && contextRequirements.length > 0 && (
                                <CheckCircle2 size={10} className="text-white" />
                            )}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewContextTab 
                            isContextComplete={isContextComplete}
                            contextRequirements={contextRequirements}
                            nodeSearch={nodeSearch}
                            setNodeSearch={setNodeSearch}
                            handleContextLinkChange={handleContextLinkChange}
                            handleLinkContextFromNode={handleLinkContextFromNode}
                        />
                    </div>
                </Tab>

                <Tab 
                    key="artefacts" 
                    title={
                        <div className="flex items-center gap-2">
                            <FileText size={12} /> 
                            Artefacts
                            {hasInReview ? (
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            ) : artefactsList.length > 0 ? (
                                <CheckCircle2 size={10} className="text-white" />
                            ) : null}
                        </div>
                    }
                >
                    <div className="h-[calc(100vh-192px)]">
                        <SpaceCrewArtefactsTab 
                            isDone={isDone}
                            artefacts={artefactsList}
                            progressValue={data.progress}
                            isWorking={isWorking}
                            editingArtefactId={editingArtefactId}
                            setEditingArtefactId={setEditingArtefactId}
                            expandedVersionHistory={expandedVersionHistory}
                            toggleVersionHistory={toggleVersionHistory}
                            handleRestoreVersion={handleRestoreVersion}
                            handleArtefactStatusChange={handleArtefactStatusChange}
                            handleArtefactOutputToggle={handleArtefactOutputToggle}
                            handleArtefactContentChange={handleArtefactContentChange}
                        />
                    </div>
                </Tab>
            </Tabs>

            {selectedTab === 'agent' && (
                <SpaceInspectorFooter>
                    {isMissingContext && (
                        <div className="space-y-3">
                            <Button 
                                size="sm" 
                                isDisabled={!isContextComplete}
                                className={cn("w-full font-black uppercase text-[10px] tracking-widest rounded-md h-12 transition-all border shadow-xl",
                                    isContextComplete ? "bg-white text-black border-white hover:bg-zinc-100 shadow-white/5" : "bg-zinc-900 text-zinc-600 border-zinc-800 shadow-none"
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
                                {data.progress > 0 ? "Wznów pracę" : (isContextComplete ? "Prepare Briefing" : `Missing context`)}
                            </Button>
                            {data.progress > 0 && (
                                <Button 
                                    size="sm" 
                                    variant="light" 
                                    className="w-full text-zinc-500 font-black uppercase text-[10px] tracking-widest rounded-md h-10 hover:bg-zinc-900/50"
                                    onPress={() => transitionTo('conversation', { progress: 0 })}
                                >
                                    Zakończ pracę
                                </Button>
                            )}
                        </div>
                    )}
                    {isConsultation && (
                        <Button size="sm" isDisabled={!allQuestionsAnswered} className="w-full font-black uppercase text-[10px] rounded-md h-10 bg-white text-black hover:bg-zinc-100 shadow-xl" onPress={submitConsultation}>
                            Send responses
                        </Button>
                    )}
                    {isAlignment && (
                        <div className="flex flex-col gap-3">
                            <Button 
                                size="sm" 
                                className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-100 shadow-xl"
                                onPress={() => transitionTo('briefing')}
                            >
                                Looks correct, proceed to plan
                            </Button>
                            <Button 
                                size="sm" 
                                variant="flat" 
                                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10"
                                onPress={() => transitionTo('conversation')}
                            >
                                Adjust assumptions
                            </Button>
                        </div>
                    )}
                    {isBriefing && (
                        <div className="flex gap-3">
                            <Button size="sm" className="flex-1 bg-white text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-100 shadow-xl" onPress={() => transitionTo('working', { progress: 5 })}>Tak, Zaczynaj</Button>
                            <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10" onPress={() => transitionTo('missing_context')}>Zmień Plan</Button>
                        </div>
                    )}
                    {isWorking && (
                        <Button size="sm" variant="flat" className="w-full bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10 hover:bg-red-950/20 hover:text-red-500 hover:border-red-900 transition-all" onPress={() => transitionTo('conversation')}>Zatrzymaj pracę</Button>
                    )}
                    {isCritique && (
                        <Button size="sm" className="w-full bg-white text-black font-black uppercase text-[10px] rounded-md h-10 shadow-xl" onPress={() => transitionTo('done', { progress: 100 })}>Finalize output</Button>
                    )}
                    {(isDone || isAborted) && (
                        <div className="flex gap-3">
                            <Button size="sm" className="flex-1 bg-zinc-200 text-black font-black uppercase text-[10px] rounded-md h-10 hover:bg-white" onPress={() => transitionTo('missing_context', { progress: 0 })}>Nowe zadanie</Button>
                            <Button size="sm" variant="flat" className="flex-1 bg-zinc-900 border border-zinc-800 text-zinc-400 font-black uppercase text-[10px] rounded-md h-10 hover:bg-zinc-800" onPress={() => setSelectedTab("artefacts")}>Historia Wersji</Button>
                        </div>
                    )}
                </SpaceInspectorFooter>
            )}
        </SpaceInspectorPanel>
    );
};
