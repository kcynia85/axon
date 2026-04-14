import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { VectorDatabasesList } from './VectorDatabasesList';
import * as useSettingsHooks from '../application/useSettings';
import React from 'react';

// 1. Top-level mocks
vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
    }),
}));

vi.mock('../application/useSettings', () => ({
    useVectorDatabases: vi.fn(),
    useDeleteVectorDatabase: vi.fn(),
}));

vi.mock('@/shared/hooks/useDeleteWithUndo', () => ({
    useDeleteWithUndo: () => ({
        deleteWithUndo: vi.fn(),
    }),
}));

describe('VectorDatabasesList (Settings Module)', () => {
    const mockedDatabases = [
        {
            id: 'vdb-1',
            vector_database_name: 'Production Qdrant',
            vector_database_type: 'QDRANT',
            vector_database_connection_url: 'http://localhost:6333',
            vector_database_connection_status: 'CONNECTED',
        },
        {
            id: 'vdb-2',
            vector_database_name: 'Milvus Staging',
            vector_database_type: 'MILVUS',
            vector_database_connection_url: 'http://milvus.stg.io',
            vector_database_connection_status: 'DISCONNECTED',
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useSettingsHooks.useVectorDatabases).mockReturnValue({
            data: mockedDatabases,
            isLoading: false,
        } as any);
        vi.mocked(useSettingsHooks.useDeleteVectorDatabase).mockReturnValue({
            mutateAsync: vi.fn(),
        } as any);
    });

    it('Happy Path: renders the list of vector databases', () => {
        render(<VectorDatabasesList />);
        
        expect(screen.getByText(/Production Qdrant/i)).toBeInTheDocument();
        expect(screen.getByText(/Milvus Staging/i)).toBeInTheDocument();
        
        // Qdrant pojawia się dwa razy (w nazwie i jako typ), więc sprawdzamy czy w ogóle jest
        const qdrantElements = screen.getAllByText(/Qdrant/i);
        expect(qdrantElements.length).toBeGreaterThan(0);
    });

    it('Happy Path: filters databases by search input', async () => {
        render(<VectorDatabasesList />);
        
        const searchInput = screen.getByPlaceholderText(/Search/i);
        fireEvent.change(searchInput, { target: { value: 'Production' } });
        
        expect(screen.getByText(/Production Qdrant/i)).toBeInTheDocument();
        expect(screen.queryByText(/Milvus Staging/i)).not.toBeInTheDocument();
    });

    it('Edge Case: handles loading state correctly', () => {
        vi.mocked(useSettingsHooks.useVectorDatabases).mockReturnValue({
            data: undefined,
            isLoading: true,
        } as any);

        const { container } = render(<VectorDatabasesList />);
        
        // Weryfikujemy istnienie skeletonów przez atrybut data-slot (używany w projekcie)
        const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
        expect(skeletons.length).toBeGreaterThan(0);
    });
});
