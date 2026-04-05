'use client';

import { useQuery } from "@tanstack/react-query";
import { useCrewInspectorBaseLogic } from "./useCrewInspectorBaseLogic";

/**
 * useSpaceCrewHierarchicalInspector - Application hook for hierarchical crew orchestration.
 * Manages specialized simulation logic and state for hierarchical processing.
 */
export const useSpaceCrewHierarchicalInspector = (crewData: any, nodeId: string, onPropertyChange: any) => {
    const crewLogic = useCrewInspectorBaseLogic(crewData, onPropertyChange);
    const {
        isWorking, progressValue, tasks, sharedMemory
    } = crewLogic;

    // Simulation for Hierarchical Crew
    useQuery({
        queryKey: ["crew-worker-hierarchical", nodeId, crewData.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const managerTask = tasks.find(taskItem => taskItem.assignedAgentTitle.toLowerCase().includes('manager'));
                const nextTasks = [...tasks];
                const nextSharedMemory = [...sharedMemory];
                
                if (managerTask?.status === 'working') {
                    if (Math.random() > 0.8) {
                        const workerTasks = nextTasks.filter(taskItem => !taskItem.assignedAgentTitle.toLowerCase().includes('manager'));
                        const pendingWorker = workerTasks.find(taskItem => taskItem.status === 'pending');
                        if (pendingWorker) {
                            const taskIndex = nextTasks.findIndex(taskItem => taskItem.id === pendingWorker.id);
                            nextTasks[taskIndex] = { 
                                ...pendingWorker, 
                                status: 'working', 
                                thought: 'Manager assigned me to this task.' 
                            };
                        }
                    }
                }

                const areAllTasksCompleted = nextTasks.every(taskItem => taskItem.status === 'done');
                onPropertyChange({ 
                    tasks: nextTasks,
                    shared_memory: nextSharedMemory,
                    state: areAllTasksCompleted ? 'done' : 'working'
                });
                return progressValue;
            }
            return progressValue;
        },
        refetchInterval: isWorking && progressValue < 100 ? 3000 : false,
        enabled: isWorking && progressValue < 100,
    });

    return {
        state: {
            ...crewLogic,
            artefacts: crewData.artefacts || [],
            hasInReview: (crewData.artefacts || []).some((artefactItem: any) => artefactItem.status === 'in_review')
        },
        actions: {
            ...crewLogic,
            submitConsultation: () => crewLogic.transitionTo('working')
        }
    };
};
