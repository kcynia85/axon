import { useState } from 'react';
import { metaAgentApi, MetaAgentDraftEntity, MetaAgentAttachment, MetaAgentProposalConnection } from '../../infrastructure/metaAgentApi';
import { useMutation } from '@tanstack/react-query';

export type MetaAgentStep = 'idle' | 'planner' | 'retriever' | 'drafter' | 'validator';

export const useMetaAgent = (spaceId: string) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [drafts, setDrafts] = useState<MetaAgentDraftEntity[]>([]);
    const [connections, setConnections] = useState<MetaAgentProposalConnection[]>([]);
    const [reasoning, setReasoning] = useState<string | null>(null);
    const [activeStep, setActiveStep] = useState<MetaAgentStep>('idle');
    
    // Settings state
    const [knowledgeEnabled, setKnowledgeEnabled] = useState(false);
    const systemAwarenessEnabled = true;

    // Attachments state
    const [attachedFiles, setAttachedFiles] = useState<MetaAgentAttachment[]>([]);

    const togglePanel = () => setIsPanelOpen(prev => !prev);
    const closePanel = () => setIsPanelOpen(false);

    const proposeMutation = useMutation({
        mutationFn: async (query: string) => {
            setActiveStep('planner');
            
            // Advance steps automatically for a "pro" feel during wait time
            const stepInterval = setInterval(() => {
                setActiveStep(curr => {
                    if (curr === 'planner') return 'retriever';
                    if (curr === 'retriever') return 'drafter';
                    if (curr === 'drafter') return 'validator';
                    return curr;
                });
            }, 2500);

            try {
                const result = await metaAgentApi.proposeDraft({ 
                    space_id: spaceId, 
                    query,
                    context: {
                        knowledge_enabled: knowledgeEnabled,
                        system_awareness_enabled: systemAwarenessEnabled
                    },
                    attachments: attachedFiles
                });
                return result;
            } finally {
                clearInterval(stepInterval);
            }
        },
        onSuccess: (data) => {
            setDrafts(data.drafts);
            setConnections(data.connections);
            setReasoning(data.reasoning);
            setActiveStep('idle');
        },
        onError: () => {
            setActiveStep('idle');
        }
    });

    const clearDraft = () => {
        setDrafts([]);
        setConnections([]);
        setReasoning(null);
        setAttachedFiles([]);
        setActiveStep('idle');
    };

    const addFiles = (newFiles: MetaAgentAttachment[]) => {
        setAttachedFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (fileName: string) => {
        setAttachedFiles(prev => prev.filter(f => f.name !== fileName));
    };

    return {
        isPanelOpen,
        togglePanel,
        closePanel,
        drafts,
        connections,
        reasoning,
        clearDraft,
        knowledgeEnabled,
        setKnowledgeEnabled,
        systemAwarenessEnabled,
        attachedFiles,
        addFiles,
        removeFile,
        activeStep,
        propose: proposeMutation.mutate,
        isProposing: proposeMutation.isPending,
        error: proposeMutation.error
    };
};
