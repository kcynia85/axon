// frontend/src/modules/spaces/application/hooks/useCrewInspectorBaseLogic.ts

import { useState, useCallback, useMemo } from "react";
import { SpaceCrewDomainData, TemplateArtefact, TemplateContext } from "../../domain/types";

const DEFAULT_CREW_CONTEXT: TemplateContext[] = [
    { id: 'creq_1', label: 'market_research_data', expectedType: 'json' },
    { id: 'creq_2', label: 'strategic_goals', expectedType: 'any' }
];

const DEFAULT_CREW_ROLES = ['Web Researcher', 'Content Writer'];

export const useCrewInspectorBaseLogic = (
    data: SpaceCrewDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(true);
    const [nodeSearch, setNodeSearch] = useState("");
    const [expandedVersionHistory, setExpandedVersions] = useState<Record<string, boolean>>({});
    const [editingArtefactId, setEditingArtefactId] = useState<string | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("orchestration");

    const isMissingContext = data.state === 'missing_context';
    const isWorking = data.state === 'working';
    const isConsultation = data.state === 'conversation';
    const isBriefing = data.state === 'briefing';
    const isDone = data.state === 'done';
    const isAborted = data.state === 'aborted';

    const roles = data.roles || DEFAULT_CREW_ROLES;

    const tasks = useMemo(() => {
        return (data.tasks && data.tasks.length > 0) ? data.tasks : roles.map((role, i) => ({
            id: `task_${i}`,
            label: `Perform analysis for ${role}`,
            status: 'pending' as const,
            assignedAgentTitle: role
        }));
    }, [data.tasks, roles]);

    const logs = data.execution_logs || [];
    const sharedMemory = data.shared_memory || [];
    
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const progressValue = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const contextRequirements = useMemo(() => {
        return (data.context_requirements && data.context_requirements.length > 0) 
            ? data.context_requirements 
            : DEFAULT_CREW_CONTEXT;
    }, [data.context_requirements]);

    const handleTaskLabelChange = useCallback((taskId: string, newLabel: string) => {
        const nextTasks = tasks.map(t => t.id === taskId ? { ...t, label: newLabel } : t);
        onPropertyChange({ tasks: nextTasks });
    }, [tasks, onPropertyChange]);

    const handleArtefactContentChange = useCallback((artefactId: string, content: string) => {
        const nextArtefacts = (data.artefacts || []).map(a => 
            a.id === artefactId ? { ...a, content } : a
        );
        onPropertyChange({ artefacts: nextArtefacts });
    }, [data.artefacts, onPropertyChange]);

    const handleContextLinkChange = useCallback((contextId: string, link: string) => {
        const newContexts = contextRequirements.map(c => 
            c.id === contextId ? { ...c, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : c
        );
        onPropertyChange('context_requirements', newContexts);
    }, [contextRequirements, onPropertyChange]);

    const handleLinkContextFromNode = useCallback((contextId: string, nodeLabel: string, artifactLabel: string) => {
        const newContexts = contextRequirements.map(c => 
            c.id === contextId 
                ? { ...c, link: `node://${nodeLabel}/${artifactLabel}`, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel } 
                : c
        );
        onPropertyChange('context_requirements', newContexts);
    }, [contextRequirements, onPropertyChange]);

    const handleArtefactStatusChange = useCallback((artefactId: string, status: TemplateArtefact['status']) => {
        const newArtefacts = (data.artefacts || []).map(a => 
            a.id === artefactId ? { ...a, status } : a
        );
        onPropertyChange('artefacts', newArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const handleArtefactOutputToggle = useCallback((artefactId: string) => {
        const newArtefacts = (data.artefacts || []).map(a => 
            a.id === artefactId ? { ...a, isOutput: !a.isOutput } : a
        );
        onPropertyChange('artefacts', newArtefacts);
    }, [data.artefacts, onPropertyChange]);

    const toggleVersionHistory = useCallback((id: string) => {
        setExpandedVersions(prev => ({ ...prev, [id]: !prev[id] }));
    }, []);

    const handleRestoreVersion = useCallback((artefactId: string, versionLabel: string) => {
        const newArtefacts = (data.artefacts || []).map(a => 
            a.id === artefactId ? { ...a, label: `article_${versionLabel.toLowerCase()}.md`, status: 'in_review' as const } : a
        );
        onPropertyChange('artefacts', newArtefacts);
        toggleVersionHistory(artefactId);
    }, [data.artefacts, onPropertyChange, toggleVersionHistory]);

    const transitionTo = useCallback((state: string, extraProps: Record<string, unknown> = {}) => {
        onPropertyChange({ state, ...extraProps });
    }, [onPropertyChange]);

    const handleAnswerChange = useCallback((questionId: string, answer: string) => {
        setConsultationAnswers(prev => ({ ...prev, [questionId]: answer }));
    }, []);

    const missingFields = useMemo(() => 
        contextRequirements.filter(r => !r.link && !r.sourceNodeLabel),
    [contextRequirements]);

    const isContextComplete = useMemo(() => 
        missingFields.length === 0,
    [missingFields]);

    const consultationQuestions = data.consultation_questions || [];
    const allQuestionsAnswered = consultationQuestions.length > 0 && 
        consultationQuestions.every(q => !!consultationAnswers[q.id] || !!q.answer);

    return {
        consultationAnswers,
        setConsultationAnswers,
        consultationQuestions,
        allQuestionsAnswered,
        isLogsOpen,
        setIsLogsOpen,
        isDetailsOpen,
        setIsDetailsOpen,
        nodeSearch,
        setNodeSearch,
        expandedVersionHistory,
        setExpandedVersions,
        editingArtefactId,
        setEditingArtefactId,
        selectedTab,
        setSelectedTab,
        isMissingContext,
        isWorking,
        isConsultation,
        isBriefing,
        isDone,
        isAborted,
        tasks,
        logs,
        sharedMemory,
        completedTasks,
        totalTasks,
        progressValue,
        handleTaskLabelChange,
        handleArtefactContentChange,
        handleContextLinkChange,
        handleLinkContextFromNode,
        handleArtefactStatusChange,
        handleArtefactOutputToggle,
        toggleVersionHistory,
        handleRestoreVersion,
        transitionTo,
        onStatusChange: transitionTo,
        handleAnswerChange,
        isContextComplete,
        contextRequirements,
        missingFields
    };
};
