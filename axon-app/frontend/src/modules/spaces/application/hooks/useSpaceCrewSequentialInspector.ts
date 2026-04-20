'use client';

import { useQuery } from "@tanstack/react-query";
import { SharedMemoryEntry } from "../../domain/types";
import { useCrewInspectorBaseLogic } from "./useCrewInspectorBaseLogic";

export const useSpaceCrewSequentialInspector = (data: any, nodeId: string, onPropertyChange: any) => {
    const logic = useCrewInspectorBaseLogic(data, onPropertyChange);
    const {
        isMissingContext, isWorking, isConsultation, isBriefing, isDone, isAborted, isIdle,
        tasks, progressValue, transitionTo, handleAnswerChange,
        allQuestionsAnswered, consultationAnswers, consultationQuestions,
        sharedMemory,
        isContextComplete, contextRequirements, nodeSearch, setNodeSearch,
        editingArtefactId, setEditingArtefactId,
        toggleVersionHistory, handleRestoreVersion,
        handleArtefactContentChange,
        selectedTab, setSelectedTab, isDetailsOpen, setIsDetailsOpen,
        logs, isLogsOpen, setIsLogsOpen
    } = logic;

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
                        if (Math.random() > 0.7) {
                            nextTasks[currentTaskIndex] = { ...currentTask, status: 'done', thought: 'Task completed successfully.' };
                            const facts = ["Sequential step finalized.", "Data passed to next agent."];
                            const newFact: SharedMemoryEntry = {
                                id: `fact_${Date.now()}`,
                                fact: facts[Math.floor(Math.random() * facts.length)],
                                sourceAgentTitle: currentTask.assignedAgentTitle,
                                timestamp: new Date().toLocaleTimeString()
                            };
                            nextSharedMemory.push(newFact);
                        } else {
                            nextTasks[currentTaskIndex] = { ...currentTask, thought: 'Processing in order...' };
                        }
                    }

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
        const updatedQuestions = consultationQuestions.map(q => ({ ...q, answer: consultationAnswers[q.id] || q.answer }));
        transitionTo('working', { consultation_questions: updatedQuestions });
    };

    return {
        state: {
            isMissingContext, isWorking, isConsultation, isBriefing, isDone, isAborted, isIdle,
            tasks, progressValue, allQuestionsAnswered, consultationAnswers, consultationQuestions,
            sharedMemory, isContextComplete, contextRequirements, nodeSearch,
            editingArtefactId, selectedTab, isDetailsOpen, logs, isLogsOpen,
            artefacts: data.artefacts || [],
            expandedVersionHistory: logic.expandedVersionHistory,
            hasInReview: (data.artefacts || []).some((a: any) => a.status === 'in_review')
        },
        actions: {
            transitionTo, handleAnswerChange, setNodeSearch,
            setEditingArtefactId, toggleVersionHistory, handleRestoreVersion,
            handleArtefactContentChange, setSelectedTab, setIsDetailsOpen,
            submitConsultation,
            handleTaskLabelChange: logic.handleTaskLabelChange,
            handleContextLinkChange: logic.handleContextLinkChange,
            handleKnowledgeHubsChange: logic.handleKnowledgeHubsChange,
            handleLinkContextFromNode: logic.handleLinkContextFromNode,
            handleArtefactStatusChange: logic.handleArtefactStatusChange,
            handleArtefactOutputToggle: logic.handleArtefactOutputToggle
        }
    };
};
