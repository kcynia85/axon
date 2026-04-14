import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PromptArchetypeEditor } from './PromptArchetypeEditor';
import * as usePromptArchetypesHooks from '../application/usePromptArchetypes';
import React from 'react';

// 1. Top-level mocks
vi.mock('../application/usePromptArchetypes', () => ({
    useCreatePromptArchetype: vi.fn(),
}));

describe('PromptArchetypeEditor (Resources Module)', () => {
    const onOpenChangeMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(usePromptArchetypesHooks.useCreatePromptArchetype).mockReturnValue({
            mutateAsync: vi.fn().mockResolvedValue({}),
            isPending: false,
        } as any);
    });

    it('Happy Path: allows filling and submitting the form', async () => {
        render(<PromptArchetypeEditor open={true} onOpenChange={onOpenChangeMock} />);
        
        fireEvent.change(screen.getByPlaceholderText(/e.g. Master Strategist/i), {
            target: { value: 'Test Archetype' }
        });
        fireEvent.change(screen.getByPlaceholderText(/e.g. Finance, QA, R&D/i), {
            target: { value: 'Engineering' }
        });
        
        const submitButton = screen.getByText(/Register Archetype/i);
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(onOpenChangeMock).toHaveBeenCalledWith(false);
        });
    });

    it('Alternative Path: allows aborting the creation', () => {
        render(<PromptArchetypeEditor open={true} onOpenChange={onOpenChangeMock} />);
        
        const abortButton = screen.getByText(/Abort/i);
        fireEvent.click(abortButton);
        
        expect(onOpenChangeMock).toHaveBeenCalledWith(false);
    });
});
