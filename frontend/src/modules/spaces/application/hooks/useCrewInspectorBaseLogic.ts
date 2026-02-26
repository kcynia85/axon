// frontend/src/modules/spaces/application/hooks/useCrewInspectorBaseLogic.ts

import { useState, useCallback, useMemo } from "react";
import { SpaceCrewDomainData, TemplateArtefact, CrewTask } from "../../domain/types";

export const useCrewInspectorBaseLogic = (
    data: SpaceCrewDomainData,
    onPropertyChange: (propertyNameOrObject: string | Record<string, unknown>, propertyValue?: unknown) => void
) => {
    const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
    const [isLogsOpen, setIsLogsOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
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

    const tasks = useMemo(() => {
        return (data.tasks && data.tasks.length > 0) ? data.tasks : data.roles.map((role, i) => ({
            id: `task_${i}`,
            label: `Perform analysis for ${role}`,
            status: 'pending' as const,
            assignedAgentTitle: role
        }));
    }, [data.tasks, data.roles]);

    const logs = data.execution_logs || [];
    const sharedMemory = data.shared_memory || [];
    
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const totalTasks = tasks.length;
    const progressValue = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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
        const contextRequirements = data.context_requirements || [];
        const newContexts = contextRequirements.map(c => 
            c.id === contextId ? { ...c, link, sourceNodeLabel: undefined, sourceArtifactLabel: undefined } : c
        );
        onPropertyChange('context_requirements', newContexts);
    }, [data.context_requirements, onPropertyChange]);

    const handleLinkContextFromNode = useCallback((contextId: string, nodeLabel: string, artifactLabel: string) => {
        const contextRequirements = data.context_requirements || [];
        const newContexts = contextRequirements.map(c => 
            c.id === contextId 
                ? { ...c, link: `node://${nodeLabel}/${artifactLabel}`, sourceNodeLabel: nodeLabel, sourceArtifactLabel: artifactLabel } 
                : c
        );
        onPropertyChange('context_requirements', newContexts);
    }, [data.context_requirements, onPropertyChange]);

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

    const contextRequirements = data.context_requirements || [];
    const missingFields = contextRequirements.filter(r => !r.link && !r.sourceNodeLabel);
    const isContextComplete = contextRequirements.length === 0 || missingFields.length === 0;

    return {
        consultationAnswers,
        setConsultationAnswers,
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
        handleAnswerChange,
        isContextComplete,
        contextRequirements,
        missingFields
    };
};
