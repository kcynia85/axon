import { useState } from 'react';
import { metaAgentApi, MetaAgentDraftEntity, MetaAgentAttachment, MetaAgentProposalConnection } from '../../infrastructure/metaAgentApi';
import { useMutation } from '@tanstack/react-query';

export const useMetaAgent = (spaceId: string) => {
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [drafts, setDrafts] = useState<MetaAgentDraftEntity[]>([]);
    const [connections, setConnections] = useState<MetaAgentProposalConnection[]>([]);
    const [reasoning, setReasoning] = useState<string | null>(null);
    
    // Settings state
    const [knowledgeEnabled, setKnowledgeEnabled] = useState(false);
    const systemAwarenessEnabled = true;

    // Attachments state
    const [attachedFiles, setAttachedFiles] = useState<MetaAgentAttachment[]>([]);

    const togglePanel = () => setIsPanelOpen(prev => !prev);
    const closePanel = () => setIsPanelOpen(false);

    const proposeMutation = useMutation({
        mutationFn: async (query: string) => {
            return await metaAgentApi.proposeDraft({ 
                space_id: spaceId, 
                query,
                context: {
                    knowledge_enabled: knowledgeEnabled,
                    system_awareness_enabled: systemAwarenessEnabled
                },
                attachments: attachedFiles
            });
        },
        onSuccess: (data) => {
            setDrafts(data.drafts);
            setConnections(data.connections);
            setReasoning(data.reasoning);
        }
    });

    const clearDraft = () => {
        setDrafts([]);
        setConnections([]);
        setReasoning(null);
        setAttachedFiles([]);
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
        propose: proposeMutation.mutate,
        isProposing: proposeMutation.isPending,
        error: proposeMutation.error
    };
};
