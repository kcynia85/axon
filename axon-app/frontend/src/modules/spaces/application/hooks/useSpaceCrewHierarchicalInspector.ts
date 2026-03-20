'use client';

import { useQuery } from "@tanstack/react-query";
import { SharedMemoryEntry } from "../../domain/types";
import { useCrewInspectorBaseLogic } from "./useCrewInspectorBaseLogic";

export const useSpaceCrewHierarchicalInspector = (data: any, nodeId: string, onPropertyChange: any) => {
    const logic = useCrewInspectorBaseLogic(data, onPropertyChange);
    const {
        isWorking, progressValue, tasks, sharedMemory, onStatusChange
    } = logic;

    // Simulation for Hierarchical Crew
    useQuery({
        queryKey: ["crew-worker-hierarchical", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const managerTask = tasks.find(t => t.assignedAgentTitle.toLowerCase().includes('manager'));
                const nextTasks = [...tasks];
                const nextSharedMemory = [...sharedMemory];
                
                if (managerTask?.status === 'working') {
                    if (Math.random() > 0.8) {
                        const workerTasks = nextTasks.filter(t => !t.assignedAgentTitle.toLowerCase().includes('manager'));
                        const pendingWorker = workerTasks.find(t => t.status === 'pending');
                        if (pendingWorker) {
                            const idx = nextTasks.findIndex(t => t.id === pendingWorker.id);
                            nextTasks[idx] = { ...pendingWorker, status: 'working', thought: 'Manager assigned me to this task.' };
                        }
                    }
                }

                const allDone = nextTasks.every(t => t.status === 'done');
                onPropertyChange({ 
                    tasks: nextTasks,
                    shared_memory: nextSharedMemory,
                    state: allDone ? 'done' : 'working'
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
            ...logic,
            artefacts: data.artefacts || [],
            hasInReview: (data.artefacts || []).some((a: any) => a.status === 'in_review')
        },
        actions: {
            ...logic,
            submitConsultation: () => logic.transitionTo('working')
        }
    };
};
