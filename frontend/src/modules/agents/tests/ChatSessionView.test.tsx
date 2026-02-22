import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChatSessionView } from '../features/chat-session/ui/ChatSessionView'
import { AgentRole } from '../domain'

// Mock ai/rsc
vi.mock('ai/rsc', () => ({
    useUIState: vi.fn().mockReturnValue([[], vi.fn()]),
    useActions: vi.fn().mockReturnValue({ submitUserMessage: vi.fn() })
}))

// Mock ScrollArea and other UI if needed (Shadcn components often need ResizeObserver or similar)
// But usually shallow render or JSDOM handles basic divs.
// The previous test mocked scrollIntoView.

describe('ChatSessionView', () => {
    beforeEach(() => {
        window.HTMLElement.prototype.scrollIntoView = vi.fn()
    })

    it('renders input and header', () => {
        render(<ChatSessionView projectId="1" agentRole={AgentRole.MANAGER} />)
        
        expect(screen.getByText('MANAGER Agent')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Ask MANAGER anything/i)).toBeInTheDocument()
    })
})
