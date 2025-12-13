import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChatSessionView } from '../components/chat-session-view'
import { AgentRole } from '../types'
import * as useAgentSessionHook from '../hooks/use-agent-session'

// Mock the hook
vi.mock('../hooks/use-agent-session', () => ({
    useAgentSession: vi.fn()
}))

describe('ChatSessionView', () => {
    beforeEach(() => {
        // Mock scrollIntoView which is not implemented in JSDOM
        window.HTMLElement.prototype.scrollIntoView = vi.fn()
    })

    it('renders input and header', () => {
        (useAgentSessionHook.useAgentSession as any).mockReturnValue({
            sessionHistory: [],
            submitUserQuery: vi.fn(),
            isAgentThinking: false
        })

        render(<ChatSessionView projectId="1" agentRole={AgentRole.MANAGER} />)
        
        expect(screen.getByText('MANAGER Agent')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Ask MANAGER anything/i)).toBeInTheDocument()
    })
})
