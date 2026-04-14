import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { InternalToolsList } from './InternalToolsList';
import React from 'react';

// Mock hooków współdzielonych - na poziomie modułu (top-level)
vi.mock('@/shared/hooks/useDeleteWithUndo', () => ({
    useDeleteWithUndo: () => ({
        deleteWithUndo: vi.fn(),
    }),
}));

const mockedTools = [
    {
        id: 'tool-1',
        tool_function_name: 'calculator',
        tool_display_name: 'Super Calculator',
        tool_description: 'Performs complex math',
        tool_category: 'math',
        is_active: true,
    },
    {
        id: 'tool-2',
        tool_function_name: 'search',
        tool_display_name: 'Web Search',
        tool_description: 'Searches the web',
        tool_category: 'utility',
        is_active: true,
    }
];

describe('InternalToolsList (Resources Module)', () => {
    const onSelectMock = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.spyOn(window, 'confirm').mockImplementation(() => true);
    });

    it('Happy Path: renders the list of tools correctly', () => {
        render(<InternalToolsList tools={mockedTools} onSelect={onSelectMock} />);
        
        expect(screen.getByText(/Super Calculator/i)).toBeInTheDocument();
        expect(screen.getByText(/Web Search/i)).toBeInTheDocument();
        // Używamy regexa dla tagów, bo mogą być w Badge'ach z dodatkowym formatowaniem
        expect(screen.getByText(/math/i)).toBeInTheDocument();
    });

    it('Happy Path: calls onSelect when a tool is clicked', () => {
        render(<InternalToolsList tools={mockedTools} onSelect={onSelectMock} />);
        
        const toolCard = screen.getByText(/Super Calculator/i);
        fireEvent.click(toolCard);
        
        expect(onSelectMock).toHaveBeenCalled();
    });

    it('Negative Path: displays empty state when no tools are provided', () => {
        render(<InternalToolsList tools={[]} onSelect={onSelectMock} />);
        
        expect(screen.getByText(/No tools found/i)).toBeInTheDocument();
    });
});
