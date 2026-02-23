// frontend/src/modules/spaces/domain/mappers/__tests__/SpaceNodeViewModelMapper.test.ts

import { describe, it, expect } from 'vitest';
import { 
    mapAgentToViewModel, 
    mapEntityToViewModel,
    mapZoneToViewModel 
} from '../SpaceNodeViewModelMapper';
import { SpaceAgentDomainData, SpaceEntityNodeDomainData, SpaceZoneDomainData } from '../../types';

describe('SpaceNodeViewModelMapper', () => {
    describe('mapAgentToViewModel', () => {
        it('should map agent domain data to view model correctly', () => {
            const domainData: SpaceAgentDomainData = {
                label: 'User Researcher',
                state: 'working',
                progress: 45,
                zoneColor: 'purple',
            };

            const viewModel = mapAgentToViewModel(domainData, false);

            expect(viewModel.displayName).toBe('User Researcher');
            expect(viewModel.statusText).toBe('WORKING');
            expect(viewModel.progressValue).toBe(45);
            expect(viewModel.progressLabel).toBe('45%');
            expect(viewModel.visual.containerClassName).toContain('border-zinc-700');
        });

        it('should apply selected styles when isSelected is true', () => {
            const domainData: SpaceAgentDomainData = {
                label: 'User Researcher',
                state: 'working',
                progress: 45,
                zoneColor: 'purple',
            };

            const viewModel = mapAgentToViewModel(domainData, true);

            expect(viewModel.visual.containerClassName).toContain('border-purple-500');
            expect(viewModel.visual.containerClassName).toContain('shadow-');
        });
    });

    describe('mapEntityToViewModel', () => {
        it('should map entity domain data to view model with correct icon', () => {
            const domainData: SpaceEntityNodeDomainData = {
                label: 'Custom Bot',
                type: 'agent',
                zoneColor: 'blue',
                status: 'active',
                description: 'A helpful bot'
            };

            const viewModel = mapEntityToViewModel(domainData, false);

            expect(viewModel.displayName).toBe('Custom Bot');
            expect(viewModel.componentType).toBe('AGENT');
            expect(viewModel.statusLabel).toBe('ACTIVE');
            expect(viewModel.isStatusActive).toBe(true);
            expect(viewModel.VisualIcon).toBeDefined();
        });
    });

    describe('mapZoneToViewModel', () => {
        it('should map zone domain data with fallback colors', () => {
            const domainData: SpaceZoneDomainData = {
                label: 'Discovery',
                type: 'discovery',
            };

            const viewModel = mapZoneToViewModel(domainData, false);

            expect(viewModel.displayName).toBe('DISCOVERY');
            expect(viewModel.containerClassName).toContain('border-purple-500');
        });
    });
});
