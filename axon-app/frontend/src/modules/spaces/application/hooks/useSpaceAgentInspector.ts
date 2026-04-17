'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TemplateContext, TemplateArtefact } from "../../domain/types";

export const useSpaceAgentInspector = (data: any, nodeId: string, onPropertyChange: any) => {
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

    const consultationQuestions = data.consultation_questions || [];

    const allQuestionsAnswered = consultationQuestions.length > 0 ? consultationQuestions.every((q: any) => 
        (q.answer && q.answer.trim().length > 0) || 
        (consultationAnswers[q.id] && consultationAnswers[q.id].trim().length > 0)
    ) : true;

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
                    metrics: { ...data.metrics, tokens: nextTokens }, 
                    state: nextState 
                });
                return nextProgress;
            }
            return data.progress;
        },
        refetchInterval: isWorking && data.progress < 100 ? 1000 : false,
        enabled: isWorking && data.progress < 100,
    });

    const contextRequirements: readonly TemplateContext[] = data.context_requirements || [];
    const missingFields = contextRequirements.filter(r => !r.link && !r.sourceNodeLabel);
    const isContextComplete = missingFields.length === 0;

    // Use plan_steps from entity, evenly distributed across 0-100 progress thresholds
    const workingLogs = (data.plan_steps || []).map((step: any, idx: number, arr: any[]) => ({
        threshold: Math.floor((idx / Math.max(arr.length, 1)) * 100),
        label: step.label
    }));
    
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
        const updatedQuestions = consultationQuestions.map((q: any) => ({ ...q, answer: consultationAnswers[q.id] || q.answer }));
        const nextState = data.requires_alignment ? 'alignment' : 'briefing';
        transitionTo(nextState, { 
            consultation_questions: updatedQuestions,
            alignment_summary: data.alignment_summary || "Gotowy.",
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

    const getCurrentArtefacts = () => {
        return data.artefacts || [];
    };

    const handleArtefactStatusChange = (id: string, status: TemplateArtefact['status']) => {
        const current = getCurrentArtefacts();
        const next = current.map((a: any) => a.id === id ? { ...a, status } : a);
        onPropertyChange('artefacts', next);
    };

    const handleArtefactOutputToggle = (id: string) => {
        const current = getCurrentArtefacts();
        const next = current.map((a: any) => a.id === id ? { ...a, isOutput: !a.isOutput } : a);
        onPropertyChange('artefacts', next);
    };

    const handleArtefactContentChange = (id: string, content: string) => {
        const current = getCurrentArtefacts();
        const next = current.map((a: any) => a.id === id ? { ...a, content } : a);
        onPropertyChange('artefacts', next);
    };

    const toggleVersionHistory = (id: string) => {
        setExpandedVersionHistory(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleRestoreVersion = (artefactId: string, versionLabel: string) => {
        const current = getCurrentArtefacts();
        const next = current.map((a: any) => 
            a.id === artefactId ? { ...a, label: `article_${versionLabel.toLowerCase()}.md`, status: 'in_review' as const } : a
        );
        onPropertyChange('artefacts', next);
        toggleVersionHistory(artefactId);
    };

    const currentTaskLabel = workingLogs.find((log: any, i: number) => 
        data.progress >= log.threshold && (i === workingLogs.length - 1 || data.progress < workingLogs[i+1].threshold)
    )?.label;

    return {
        state: {
            nodeSearch,
            isDetailsOpen,
            consultationAnswers,
            selectedTab,
            editingArtefactId,
            expandedVersionHistory,
            isMissingContext,
            isBriefing,
            isWorking,
            isDone,
            isAborted,
            isConsultation,
            isAlignment,
            isCritique,
            allQuestionsAnswered,
            isContextComplete,
            consultationQuestions,
            contextRequirements,
            workingLogs,
            simulatedTokens,
            elapsedSeconds,
            remainingSeconds,
            currentTaskLabel,
            artefactsList: getCurrentArtefacts(),
            hasInReview: getCurrentArtefacts().some((a: any) => a.status === 'in_review')
        },
        actions: {
            setNodeSearch,
            setIsDetailsOpen,
            setSelectedTab,
            setEditingArtefactId,
            handleAnswerChange,
            submitConsultation,
            handleContextLinkChange,
            handleLinkContextFromNode,
            handleArtefactStatusChange,
            handleArtefactOutputToggle,
            handleArtefactContentChange,
            toggleVersionHistory,
            handleRestoreVersion,
            transitionTo,
            formatTime
        }
    };
};
