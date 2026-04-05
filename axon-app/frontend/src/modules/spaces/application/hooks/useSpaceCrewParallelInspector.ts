'use client';

import { useQuery } from "@tanstack/react-query";
import { useCrewInspectorBaseLogic } from "./useCrewInspectorBaseLogic";

/**
 * useSpaceCrewParallelInspector - Application hook for parallel crew orchestration.
 * Manages concurrent simulation logic and state for parallel processing.
 */
export const useSpaceCrewParallelInspector = (crewData: any, nodeId: string, onPropertyChange: any) => {
    const crewLogic = useCrewInspectorBaseLogic(crewData, onPropertyChange);
    const { isWorking, progressValue, tasks } = crewLogic;

    // Simulation for Parallel Crew
    useQuery({
        queryKey: ["crew-worker-parallel", nodeId, crewData.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const nextTasks = tasks.map(taskItem => {
                    if (taskItem.status === 'pending') {
                        return { ...taskItem, status: 'working' as const, thought: 'Parallel processing started...' };
                    }
                    if (taskItem.status === 'working' && Math.random() > 0.8) {
                        return { ...taskItem, status: 'done' as const, thought: 'Concurrent task finished.' };
                    }
                    return taskItem;
                });

                const areAllTasksCompleted = nextTasks.every(taskItem => taskItem.status === 'done');
                onPropertyChange({ 
                    tasks: nextTasks,
                    state: areAllTasksCompleted ? 'done' : 'working'
                });
                return progressValue;
            }
            return progressValue;
        },
        refetchInterval: isWorking && progressValue < 100 ? 2500 : false,
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
