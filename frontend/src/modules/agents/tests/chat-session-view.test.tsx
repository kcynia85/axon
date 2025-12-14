import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ChatSessionView } from '../features/chat-session/ui/chat-session-view'
import { AgentRole } from '../domain'
import * as useChatSessionHook from '../features/chat-session/application/useChatSession'

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
        (useChatSessionHook.useChatSession as any).mockReturnValue({
            sessionHistory: [],
            submitUserQuery: vi.fn(),
            isAgentThinking: false
        })

        render(<ChatSessionView projectId="1" agentRole={AgentRole.MANAGER} />)
        
        expect(screen.getByText('MANAGER Agent')).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/Ask MANAGER anything/i)).toBeInTheDocument()
    })
})
