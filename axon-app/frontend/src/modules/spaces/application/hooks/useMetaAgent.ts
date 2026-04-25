import { metaAgentApi, MetaAgentAttachment, MetaAgentContextStats } from '../../infrastructure/metaAgentApi';
import { useMutation } from '@tanstack/react-query';
import { countTokens } from '@/shared/lib/tokenization';
import { useMetaAgentStore, MetaAgentStep } from './useMetaAgentStore';

/**
 * useMetaAgent Hook (Axon Standard: Zero useEffect, Zero useMemo)
 * 
 * Logic is entirely event-driven or derived during render. 
 * React Compiler handles underlying optimizations.
 */
export const useMetaAgent = (spaceId: string, canvasState?: any, projectContext?: any) => {
    const { spaces, setSpaceData, clearSpaceData } = useMetaAgentStore();
    
    // Derived state for current space with robust defaults
    const rawState = spaces[spaceId] || {};
    const state = {
        drafts: rawState.drafts || [],
        connections: rawState.connections || [],
        reasoning: rawState.reasoning || null,
        contextStats: rawState.contextStats || null,
        attachedFiles: rawState.attachedFiles || [],
        isPanelOpen: rawState.isPanelOpen || false,
        activeStep: (rawState.activeStep || 'idle') as MetaAgentStep,
        knowledgeEnabled: rawState.knowledgeEnabled || false,
        query: rawState.query || '',
        isFocused: rawState.isFocused || false,
        isMaximized: rawState.isMaximized || false,
        isPaused: rawState.isPaused || false
    };

    const systemAwarenessEnabled = true;

    // Direct Token Estimation (Lightweight)
    const calculateLiveEstimates = (): MetaAgentContextStats => {
        const stats: MetaAgentContextStats = {
            space_canvas_tokens: 0,
            system_awareness_tokens: 0,
            knowledge_tokens: 0,
            project_context_tokens: 0,
            notion_tokens: 0,
            attachments_tokens: 0,
            total_tokens: 0,
            is_estimated: true
        };

        // 1. Space Canvas Estimate (Essential data only for speed)
        if (canvasState && Array.isArray(canvasState)) {
            const minimalCanvas = canvasState.map((n: any) => ({ id: n.id, type: n.type, label: n.data?.label }));
            stats.space_canvas_tokens = countTokens(JSON.stringify(minimalCanvas), "heuristic");
        }

        // 2. Project Context Estimate
        if (projectContext) {
            const projectStr = `Project: ${projectContext.project_name || ''}\nSummary: ${projectContext.project_summary || ''}`;
            stats.project_context_tokens = countTokens(projectStr, "heuristic");
        }

        // 3. Attachments Estimate
        if (state.attachedFiles.length > 0) {
            const attachmentsStr = state.attachedFiles.map(a => `${a.name} (${a.content_type})`).join('\n');
            stats.attachments_tokens = countTokens(attachmentsStr, "heuristic");
        }

        stats.total_tokens = stats.space_canvas_tokens + stats.project_context_tokens + stats.attachments_tokens;
        return stats;
    };

    // Actual stats used in UI: either server-provided or live estimate
    const contextStats = state.contextStats || calculateLiveEstimates();

    const togglePanel = () => setSpaceData(spaceId, { isPanelOpen: !state.isPanelOpen });
    const closePanel = () => setSpaceData(spaceId, { isPanelOpen: false });
    const setKnowledgeEnabled = (enabled: boolean) => setSpaceData(spaceId, { knowledgeEnabled: enabled });
    
    const setQuery = (query: string) => setSpaceData(spaceId, { query });
    const setIsFocused = (isFocused: boolean) => setSpaceData(spaceId, { isFocused });
    const setIsMaximized = (isMaximized: boolean) => setSpaceData(spaceId, { isMaximized });
    const setIsPaused = (isPaused: boolean) => setSpaceData(spaceId, { isPaused });

    const proposeMutation = useMutation({
        mutationFn: async (query: string) => {
            // Reset state for new proposal
            setSpaceData(spaceId, { activeStep: 'planner', isPaused: false });
            
            const progression: MetaAgentStep[] = ['retriever', 'drafter', 'validator'];
            let currentStepIdx = 0;
            
            const stepInterval = setInterval(() => {
                // IMPORTANT: Fetch the absolute latest state from Zustand store inside the interval
                const latestState = useMetaAgentStore.getState().spaces[spaceId];
                
                // If paused, just skip this tick but keep the interval running
                if (latestState?.isPaused) return;

                if (currentStepIdx < progression.length) {
                    setSpaceData(spaceId, { activeStep: progression[currentStepIdx] });
                    currentStepIdx++;
                } else {
                    // All steps completed, interval can be cleared early if mutation is still running
                    // but usually the finally block handles it.
                }
            }, 2500);

            try {
                const result = await metaAgentApi.proposeDraft({ 
                    space_id: spaceId, 
                    query,
                    context: {
                        knowledge_enabled: state.knowledgeEnabled,
                        system_awareness_enabled: systemAwarenessEnabled
                    },
                    attachments: state.attachedFiles
                });
                return result;
            } finally {
                clearInterval(stepInterval);
            }
        },
        onSuccess: (data) => {
            setSpaceData(spaceId, {
                drafts: data.drafts,
                connections: data.connections,
                reasoning: data.reasoning,
                contextStats: data.context_stats ? { ...data.context_stats, is_estimated: false } : null,
                activeStep: 'idle',
                query: '' // Clear query on success
            });
        },
        onError: () => {
            setSpaceData(spaceId, { activeStep: 'idle' });
        }
    });

    const clearDraft = () => {
        clearSpaceData(spaceId);
        setSpaceData(spaceId, { activeStep: 'idle', query: '' });
    };

    const addFiles = (newFiles: MetaAgentAttachment[]) => {
        setSpaceData(spaceId, { 
            attachedFiles: [...state.attachedFiles, ...newFiles] 
        });
    };

    const removeFile = (fileName: string) => {
        setSpaceData(spaceId, { 
            attachedFiles: state.attachedFiles.filter(f => f.name !== fileName) 
        });
    };

    return {
        isPanelOpen: state.isPanelOpen,
        togglePanel,
        closePanel,
        drafts: state.drafts,
        connections: state.connections,
        reasoning: state.reasoning,
        contextStats,
        clearDraft,
        knowledgeEnabled: state.knowledgeEnabled,
        setKnowledgeEnabled,
        systemAwarenessEnabled,
        attachedFiles: state.attachedFiles,
        addFiles,
        removeFile,
        activeStep: state.activeStep,
        query: state.query,
        setQuery,
        isFocused: state.isFocused,
        setIsFocused,
        isMaximized: state.isMaximized,
        setIsMaximized,
        isPaused: state.isPaused,
        setIsPaused,
        propose: proposeMutation.mutate,
        isProposing: proposeMutation.isPending,
        error: proposeMutation.error
    };
};
