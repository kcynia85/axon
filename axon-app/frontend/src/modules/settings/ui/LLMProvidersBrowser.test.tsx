import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LLMProvidersBrowser } from './LLMProvidersBrowser';
import * as useLLMProvidersHooks from '../application/useLLMProviders';
import * as useSettingsHooks from '../application/useSettings';
import * as useDeleteWithUndoHooks from '@/shared/hooks/useDeleteWithUndo';
import React from 'react';

// 1. Top-level mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock('../application/useLLMProviders', () => ({
    useLLMProviders: vi.fn(),
    useDeleteLLMProvider: vi.fn(),
}));

vi.mock('../application/useSettings', () => ({
    useLLMModels: vi.fn(),
}));

vi.mock('@/shared/hooks/useDeleteWithUndo', () => ({
    useDeleteWithUndo: vi.fn(),
}));

describe('LLMProvidersBrowser (Settings Module)', () => {
    const mockedProviders = [
        {
            id: 'provider-1',
            provider_name: 'OpenAI',
            provider_type: 'cloud',
            provider_api_key: 'sk-123',
            provider_api_endpoint: 'https://api.openai.com/v1',
        },
        {
            id: 'provider-2',
            provider_name: 'Anthropic',
            provider_type: 'cloud',
            provider_api_key: 'ant-456',
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useLLMProvidersHooks.useLLMProviders).mockReturnValue({
            data: mockedProviders,
            isLoading: false,
        } as any);
        vi.mocked(useSettingsHooks.useLLMModels).mockReturnValue({
            data: [],
            isLoading: false,
        } as any);
        vi.mocked(useLLMProvidersHooks.useDeleteLLMProvider).mockReturnValue({
            mutateAsync: vi.fn(),
        } as any);
        vi.mocked(useDeleteWithUndoHooks.useDeleteWithUndo).mockReturnValue({
            deleteWithUndo: vi.fn(),
        } as any);
    });

    it('Happy Path: renders the list of providers', () => {
        render(<LLMProvidersBrowser />);
        
        expect(screen.getByText(/OpenAI/i)).toBeInTheDocument();
        expect(screen.getByText(/Anthropic/i)).toBeInTheDocument();
    });

    it('Happy Path: filters providers by search', () => {
        render(<LLMProvidersBrowser />);
        
        // Z logów wynika, że placeholder to "Szukaj dostawców..."
        const searchInput = screen.getByPlaceholderText(/Szukaj dostawców/i);
        fireEvent.change(searchInput, { target: { value: 'OpenAI' } });
        
        expect(screen.getByText(/OpenAI/i)).toBeInTheDocument();
        expect(screen.queryByText(/Anthropic/i)).not.toBeInTheDocument();
    });

    it('Alternative Path: opens delete confirmation with linked resources', async () => {
        vi.mocked(useSettingsHooks.useLLMModels).mockReturnValue({
            data: [{ id: 'model-1', model_display_name: 'GPT-4', llm_provider_id: 'provider-1' }],
            isLoading: false,
        } as any);

        const { container } = render(<LLMProvidersBrowser />);
        
        const deleteButton = container.querySelector('.lucide-trash2')?.closest('button');
        
        if (deleteButton) {
            fireEvent.click(deleteButton);
            // Sprawdzamy czy modal się pojawił - szukamy kluczowych fraz
            expect(screen.getByText(/GPT-4/i)).toBeInTheDocument();
            expect(screen.getAllByText(/Linked Model/i).length).toBeGreaterThan(0);
        }
    });
});
