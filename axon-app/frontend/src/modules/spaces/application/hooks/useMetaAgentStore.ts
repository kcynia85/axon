import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MetaAgentDraftEntity, MetaAgentProposalConnection, MetaAgentContextStats, MetaAgentAttachment } from '../../infrastructure/metaAgentApi';

export type MetaAgentStep = 'idle' | 'planner' | 'retriever' | 'drafter' | 'validator';

interface SpaceDraftState {
    drafts: MetaAgentDraftEntity[];
    connections: MetaAgentProposalConnection[];
    reasoning: string | null;
    contextStats: MetaAgentContextStats | null;
    attachedFiles: MetaAgentAttachment[];
    isPanelOpen: boolean;
    activeStep: MetaAgentStep;
    knowledgeEnabled: boolean;
    query: string;
    isFocused: boolean;
    isMaximized: boolean;
    isPaused: boolean;
}

interface MetaAgentStore {
    spaces: Record<string, SpaceDraftState>;
    setSpaceData: (spaceId: string, data: Partial<SpaceDraftState>) => void;
    clearSpaceData: (spaceId: string) => void;
}

const initialSpaceState: SpaceDraftState = {
    drafts: [],
    connections: [],
    reasoning: null,
    contextStats: null,
    attachedFiles: [],
    isPanelOpen: false,
    activeStep: 'idle',
    knowledgeEnabled: false,
    query: '',
    isFocused: false,
    isMaximized: false,
    isPaused: false
};

export const useMetaAgentStore = create<MetaAgentStore>()(
    persist(
        (set) => ({
            spaces: {},
            setSpaceData: (spaceId, data) => set((state) => ({
                spaces: {
                    ...state.spaces,
                    [spaceId]: {
                        ...(state.spaces[spaceId] || initialSpaceState),
                        ...data
                    }
                }
            })),
            clearSpaceData: (spaceId) => set((state) => {
                const newSpaces = { ...state.spaces };
                delete newSpaces[spaceId];
                return { spaces: newSpaces };
            })
        }),
        {
            name: 'meta-agent-drafts',
            storage: createJSONStorage(() => localStorage)
        }
    )
);
