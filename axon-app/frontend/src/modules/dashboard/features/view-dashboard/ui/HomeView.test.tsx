import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { HomeView } from './HomeView'
import React from 'react'

// Mock components that might cause issues in test environment
vi.mock('@/shared/ui/complex/MagicSphere', () => ({
    MagicSphere: () => <div data-testid="magic-sphere" />
}))

vi.mock('@/modules/projects', () => ({
    CreateProjectDialog: ({ trigger }: { trigger: React.ReactNode }) => <div>{trigger}</div>
}))

describe('HomeView', () => {
    const defaultProps = {
        messages: { messages: [], isLoading: false },
        inputValue: '',
        onInputChange: vi.fn(),
        onSubmission: vi.fn(),
        onKeyDown: vi.fn(),
    }

    it('renders the welcome message', () => {
        render(<HomeView {...defaultProps} />)
        expect(screen.getByText(/Hello, Kamil/i)).toBeInTheDocument()
        expect(screen.getByText(/How can I assist you today\?/i)).toBeInTheDocument()
    })

    it('renders the AI Assistant card', () => {
        render(<HomeView {...defaultProps} />)
        expect(screen.getByPlaceholderText(/Ask AI anything/i)).toBeInTheDocument()
    })

    it('renders Recently Used section', () => {
        render(<HomeView {...defaultProps} />)
        expect(screen.getByText(/Recently Used/i)).toBeInTheDocument()
    })

    it('renders action buttons', () => {
        render(<HomeView {...defaultProps} />)
        expect(screen.getByText(/New project/i)).toBeInTheDocument()
        expect(screen.getByText(/New space/i)).toBeInTheDocument()
    })
})
