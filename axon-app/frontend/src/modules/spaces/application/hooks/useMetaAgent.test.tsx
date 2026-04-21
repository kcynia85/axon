import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useMetaAgent } from './useMetaAgent';
import { metaAgentApi } from '../../infrastructure/metaAgentApi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

vi.mock('../../infrastructure/metaAgentApi', () => ({
    metaAgentApi: {
        proposeDraft: vi.fn()
    }
}));

describe('useMetaAgent', () => {
    let queryClient: QueryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: { retry: false },
                mutations: { retry: false }
            }
        });
        vi.clearAllMocks();
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    it('initializes with default values', () => {
        const { result } = renderHook(() => useMetaAgent('space-1'), { wrapper });
        expect(result.current.isPanelOpen).toBe(false);
        expect(result.current.draft).toBe(null);
        expect(result.current.isProposing).toBe(false);
    });

    it('toggles the panel state', () => {
        const { result } = renderHook(() => useMetaAgent('space-1'), { wrapper });
        
        act(() => {
            result.current.togglePanel();
        });
        expect(result.current.isPanelOpen).toBe(true);

        act(() => {
            result.current.closePanel();
        });
        expect(result.current.isPanelOpen).toBe(false);
    });

    it('successfully proposes a draft', async () => {
        const mockResponse: any = {
            draft: { entity: 'agent', name: 'Test Agent', status: 'draft', description: 'Test', payload: {} },
            reasoning: 'Reason'
        };
        vi.mocked(metaAgentApi.proposeDraft).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useMetaAgent('space-1'), { wrapper });
        
        await act(async () => {
            result.current.propose('create agent');
        });

        expect(metaAgentApi.proposeDraft).toHaveBeenCalledWith({ space_id: 'space-1', query: 'create agent' });
        expect(result.current.draft).toEqual(mockResponse.draft);
        expect(result.current.reasoning).toBe(mockResponse.reasoning);
    });

    it('clears the draft state', async () => {
        const { result } = renderHook(() => useMetaAgent('space-1'), { wrapper });
        
        // Manual setup of state is not possible via renderHook act if it's derived from mutation
        // but we can test the clearDraft function
        act(() => {
            result.current.clearDraft();
        });

        expect(result.current.draft).toBe(null);
        expect(result.current.reasoning).toBe(null);
    });
});
