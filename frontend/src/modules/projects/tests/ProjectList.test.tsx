import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectList } from '../features/browse-projects/ui/ProjectList'
import { ProjectViewModel } from '../features/browse-projects/ui/types'
import { TooltipProvider } from '@/shared/ui/ui/Tooltip'

const mockViewModels: ProjectViewModel[] = [
    {
        id: '1',
        title: 'P1',
        statusLabel: 'Idea',
        statusVariant: 'info',
        displayTags: ['#tag1'],
        hasMoreTags: false,
        remainingTagsCount: 0,
        artifactsCount: 0,
        workspaces: ['W1'],
        createdAt: new Date().toISOString(),
        spaceUrl: '/projects/1/space'
    },
    {
        id: '2',
        title: 'P2',
        statusLabel: 'Completed',
        statusVariant: 'success',
        displayTags: ['#tag2'],
        hasMoreTags: false,
        remainingTagsCount: 0,
        artifactsCount: 2,
        workspaces: ['W2'],
        createdAt: new Date().toISOString(),
        spaceUrl: '/projects/2/space'
    }
]

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <TooltipProvider>
            {ui}
        </TooltipProvider>
    )
}

describe('ProjectList', () => {
    it('renders empty state when no projects', () => {
        const onViewDetails = vi.fn()
        renderWithProviders(<ProjectList projects={[]} onViewDetails={onViewDetails} />)
        expect(screen.getByText(/No projects found/i)).toBeInTheDocument()
    })

    it('renders list of projects', () => {
        const onViewDetails = vi.fn()
        renderWithProviders(<ProjectList projects={mockViewModels} onViewDetails={onViewDetails} />)
        expect(screen.getByText('P1')).toBeInTheDocument()
        expect(screen.getByText('P2')).toBeInTheDocument()
    })
})
