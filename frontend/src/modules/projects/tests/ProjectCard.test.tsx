import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProjectCard } from '../features/browse-projects/ui/ProjectCard'
import { ProjectViewModel } from '../features/browse-projects/ui/types'
import { TooltipProvider } from '@/shared/ui/ui/Tooltip'

const mockViewModel: ProjectViewModel = {
    id: '1',
    title: 'Test Project',
    statusLabel: 'In Progress',
    statusVariant: 'warning',
    displayTags: ['#AI', '#Research'],
    hasMoreTags: false,
    remainingTagsCount: 0,
    artifactsCount: 5,
    workspaces: ['Design'],
    createdAt: new Date().toISOString(),
    spaceUrl: '/projects/1/space'
}

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <TooltipProvider>
            {ui}
        </TooltipProvider>
    )
}

describe('ProjectCard', () => {
    it('renders project details', () => {
        const onViewDetails = vi.fn()
        renderWithProviders(<ProjectCard viewModel={mockViewModel} onViewDetails={onViewDetails} />)

        expect(screen.getByText('Test Project')).toBeInTheDocument()
        expect(screen.getByText('In Progress')).toBeInTheDocument()
        expect(screen.getByText('#AI')).toBeInTheDocument()
        expect(screen.getByText('5')).toBeInTheDocument()
    })
})
