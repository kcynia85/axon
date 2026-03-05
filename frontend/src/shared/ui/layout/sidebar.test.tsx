import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { Sidebar, NavigationItem } from './sidebar'
import { Home, Inbox, Settings } from 'lucide-react'
import { TooltipProvider } from '@/shared/ui/ui/Tooltip'

const mockItems: NavigationItem[] = [
    { name: 'Home', href: '/home', icon: Home, hasCollapseToggle: true },
    { name: 'Inbox', href: '/inbox', icon: Inbox, badge: 5, onClick: vi.fn() },
]

const mockBottomItems: NavigationItem[] = [
    { name: 'Settings', href: '/settings', icon: Settings },
]

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <TooltipProvider>
            {ui}
        </TooltipProvider>
    )
}

describe('Sidebar', () => {
    it('renders all navigation items', () => {
        const onToggle = vi.fn()
        renderWithProviders(
            <Sidebar 
                items={mockItems} 
                bottomItems={mockBottomItems} 
                isCollapsed={false} 
                onToggle={onToggle} 
                pathname="/home" 
            />
        )
        
        expect(screen.getByText('Home')).toBeInTheDocument()
        expect(screen.getByText('Inbox')).toBeInTheDocument()
        expect(screen.getByText('Settings')).toBeInTheDocument()
    })

    it('displays badge count for items with badges', () => {
        const onToggle = vi.fn()
        renderWithProviders(
            <Sidebar 
                items={mockItems} 
                bottomItems={mockBottomItems} 
                isCollapsed={false} 
                onToggle={onToggle} 
                pathname="/home" 
            />
        )
        
        expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('calls onClick when an item with onClick is clicked', () => {
        const onToggle = vi.fn()
        const inboxClick = vi.fn()
        const itemsWithClick = [
            ...mockItems.slice(0, 1),
            { ...mockItems[1], onClick: inboxClick }
        ]
        
        renderWithProviders(
            <Sidebar 
                items={itemsWithClick} 
                bottomItems={mockBottomItems} 
                isCollapsed={false} 
                onToggle={onToggle} 
                pathname="/home" 
            />
        )
        
        fireEvent.click(screen.getByText('Inbox'))
        expect(inboxClick).toHaveBeenCalled()
    })

    it('calls onToggle when collapse button is clicked', () => {
        const onToggle = vi.fn()
        renderWithProviders(
            <Sidebar 
                items={mockItems} 
                bottomItems={mockBottomItems} 
                isCollapsed={false} 
                onToggle={onToggle} 
                pathname="/home" 
            />
        )
        
        // Find the collapse button (it has the PanelLeftClose icon)
        const collapseBtn = screen.getByRole('button', { name: /collapse sidebar/i })
        fireEvent.click(collapseBtn)
        expect(onToggle).toHaveBeenCalled()
    })

    it('shows only icons when collapsed', () => {
        const onToggle = vi.fn()
        renderWithProviders(
            <Sidebar 
                items={mockItems} 
                bottomItems={mockBottomItems} 
                isCollapsed={true} 
                onToggle={onToggle} 
                pathname="/home" 
            />
        )
        
        // In collapsed mode, text is usually hidden (not rendered or hidden via CSS)
        // Based on my code: !isCollapsed && <span>{name}</span>
        expect(screen.queryByText('Home')).not.toBeInTheDocument()
        expect(screen.queryByText('Inbox')).not.toBeInTheDocument()
    })
})
