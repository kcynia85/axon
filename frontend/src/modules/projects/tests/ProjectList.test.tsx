import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { ProjectList } from '../features/browse-projects/ui/ProjectList'
import { Project, ProjectStatus, HubType } from '../domain'

describe('ProjectList', () => {
    it('renders empty state when no projects', () => {
        render(<ProjectList projects={[]} />)
        expect(screen.getByText(/No projects found/i)).toBeInTheDocument()
    })

    it('renders list of projects', () => {
        const projects: Project[] = [
            { id: '1', name: 'P1', domain: HubType.CODING, status: ProjectStatus.IDEA, owner_id: '1', created_at: new Date().toISOString(), updated_at: '' },
            { id: '2', name: 'P2', domain: HubType.DESIGN, status: ProjectStatus.ACTIVE, owner_id: '1', created_at: new Date().toISOString(), updated_at: '' }
        ]
        
        render(<ProjectList projects={projects} />)
        expect(screen.getByText('P1')).toBeInTheDocument()
        expect(screen.getByText('P2')).toBeInTheDocument()
    })
})
