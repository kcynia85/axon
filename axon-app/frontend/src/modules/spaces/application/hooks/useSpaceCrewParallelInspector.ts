'use client';

import { useQuery } from "@tanstack/react-query";
import { useCrewInspectorBaseLogic } from "./useCrewInspectorBaseLogic";

export const useSpaceCrewParallelInspector = (data: any, nodeId: string, onPropertyChange: any) => {
    const logic = useCrewInspectorBaseLogic(data, onPropertyChange);
    const { isWorking, progressValue, tasks } = logic;

    // Simulation for Parallel Crew
    useQuery({
        queryKey: ["crew-worker-parallel", nodeId, data.state],
        queryFn: async () => {
            if (isWorking && progressValue < 100) {
                const nextTasks = tasks.map(t => {
                    if (t.status === 'pending') return { ...t, status: 'working' as const, thought: 'Parallel processing started...' };
                    if (t.status === 'working' && Math.random() > 0.8) return { ...t, status: 'done' as const, thought: 'Concurrent task finished.' };
                    return t;
                });

                const allDone = nextTasks.every(t => t.status === 'done');
                onPropertyChange({ 
                    tasks: nextTasks,
                    state: allDone ? 'done' : 'working'
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
