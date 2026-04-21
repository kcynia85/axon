import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetaAgentPanel } from './MetaAgentPanel';
import React from 'react';

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('MetaAgentPanel', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        draft: null,
        reasoning: null,
        isProposing: false,
        error: null,
        onPropose: vi.fn(),
        onApproveDraft: vi.fn(),
        onRejectDraft: vi.fn(),
        onNewChat: vi.fn(),
        contextLabel: 'Space Canvas',
    };

    it('renders the initial state correctly', () => {
        render(<MetaAgentPanel {...defaultProps} />);
        expect(screen.getByText(/What kind of flow should I draft\?/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Describe the agent, crew, or task/i)).toBeInTheDocument();
    });

    it('calls onPropose when a suggestion is clicked', () => {
        render(<MetaAgentPanel {...defaultProps} />);
        const suggestion = screen.getByText(/Draft a Data Analyst Agent/i);
        fireEvent.click(suggestion);
        expect(defaultProps.onPropose).toHaveBeenCalledWith("Draft a Data Analyst Agent");
    });

    it('calls onPropose when query is submitted via keyboard', () => {
        render(<MetaAgentPanel {...defaultProps} />);
        const input = screen.getByPlaceholderText(/Describe the agent, crew, or task/i);
        fireEvent.change(input, { target: { value: 'Create a researcher' } });
        fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        expect(defaultProps.onPropose).toHaveBeenCalledWith("Create a researcher");
    });

    it('renders the generating state', () => {
        render(<MetaAgentPanel {...defaultProps} isProposing={true} />);
        expect(screen.getByText(/Generating draft\.\.\./i)).toBeInTheDocument();
    });

    it('renders the draft proposal', () => {
        const draft: any = {
            entity: 'agent',
            status: 'draft',
            name: 'Researcher Agent',
            description: 'Extracts information from web',
            payload: {}
        };
        render(<MetaAgentPanel {...defaultProps} draft={draft} reasoning="Based on user needs" />);
        
        expect(screen.getByText(/Proposed Draft: agent/i)).toBeInTheDocument();
        expect(screen.getByText(/Researcher Agent/i)).toBeInTheDocument();
        expect(screen.getByText(/Based on user needs/i)).toBeInTheDocument();
    });

    it('calls onApproveDraft when Apply is clicked', () => {
        const draft: any = {
            entity: 'agent',
            status: 'draft',
            name: 'Researcher Agent',
            description: 'Extracts info',
            payload: {}
        };
        render(<MetaAgentPanel {...defaultProps} draft={draft} />);
        
        fireEvent.click(screen.getByText(/Apply/i));
        expect(defaultProps.onApproveDraft).toHaveBeenCalledWith(draft);
    });

    it('calls onClose when close icon is clicked', () => {
        render(<MetaAgentPanel {...defaultProps} />);
        const closeButton = screen.getByTitle(/Close/i);
        fireEvent.click(closeButton);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
