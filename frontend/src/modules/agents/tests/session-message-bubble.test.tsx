import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { SessionMessageBubble } from '../features/chat-session/ui/session-message-bubble'
import { Message } from '../domain'
import { AgentRole } from '../domain'

describe('SessionMessageBubble', () => {
    it('renders user message correctly', () => {
        const msg: Message = { role: 'user', content: 'Hello World' }
        render(<SessionMessageBubble message={msg} />)
        expect(screen.getByText('Hello World')).toBeInTheDocument()
    })

    it('renders agent message correctly', () => {
        const msg: Message = { role: 'model', content: 'AI Response' }
        render(<SessionMessageBubble message={msg} />)
        expect(screen.getByText('AI Response')).toBeInTheDocument()
    })
})
