import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectCard } from '../features/browse-projects/ui/project-card'
import { Project, ProjectStatus, HubType } from '../domain'

const mockProject: Project = {
    id: '1',
    name: 'Test Project',
    description: 'Test Description',
    domain: HubType.CODING,
    status: ProjectStatus.ACTIVE,
    owner_id: 'user-1',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
}

describe('ProjectCard', () => {
    it('renders project details', () => {
        render(<ProjectCard project={mockProject} />)
        
        expect(screen.getByText('Test Project')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText(/CODING HUB/i)).toBeInTheDocument()
        expect(screen.getByText('ACTIVE')).toBeInTheDocument()
    })
})
