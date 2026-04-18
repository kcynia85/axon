import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// 1. Verify Node Mapping
import { canvasNodeComponents } from '../ui/nodes';
import { SpaceAgentCanvasNode } from '../ui/nodes/SpaceAgentCanvasNode';
import { SpaceCrewCanvasNode } from '../ui/nodes/SpaceCrewCanvasNode';
import { SpaceTemplateCanvasNode } from '../ui/nodes/SpaceTemplateCanvasNode';
import { SpaceAutomationCanvasNode } from '../ui/nodes/SpaceAutomationCanvasNode';
import { SpaceServiceCanvasNode } from '../ui/nodes/SpaceServiceCanvasNode';

// 2. Verify Inspector Mapping
import { SpaceCanvasRightSidebarView } from '../ui/pure/SpaceCanvasRightSidebarView';
import { SpaceCanvasNodeInformation } from '../domain/types';

// Mock the inspectors to just render a predictable text
vi.mock('../ui/inspectors/SpaceAgentNodeInspector', () => ({
    SpaceAgentNodeInspector: () => <div data-testid="agent-inspector">Agent Inspector</div>
}));
vi.mock('../ui/inspectors/SpaceCrewNodeInspector', () => ({
    SpaceCrewNodeInspector: () => <div data-testid="crew-inspector">Crew Inspector</div>
}));
vi.mock('../ui/inspectors/SpaceTemplateNodeInspector', () => ({
    SpaceTemplateNodeInspector: () => <div data-testid="template-inspector">Template Inspector</div>
}));
vi.mock('../ui/inspectors/SpaceAutomationNodeInspector', () => ({
    SpaceAutomationNodeInspector: () => <div data-testid="automation-inspector">Automation Inspector</div>
}));
vi.mock('../ui/inspectors/SpaceServiceNodeInspector', () => ({
    SpaceServiceNodeInspector: () => <div data-testid="service-inspector">Service Inspector</div>
}));

describe('Space Canvas Mapping E2E Verification', () => {
    describe('Node Components Mapping (Space Canvas Nodes)', () => {
        it('should correctly map agent to SpaceAgentCanvasNode', () => {
            expect(canvasNodeComponents.agent).toBe(SpaceAgentCanvasNode);
        });

        it('should correctly map crew to SpaceCrewCanvasNode', () => {
            expect(canvasNodeComponents.crew).toBe(SpaceCrewCanvasNode);
        });

        it('should correctly map template to SpaceTemplateCanvasNode', () => {
            expect(canvasNodeComponents.template).toBe(SpaceTemplateCanvasNode);
        });

        it('should correctly map automation to SpaceAutomationCanvasNode', () => {
            expect(canvasNodeComponents.automation).toBe(SpaceAutomationCanvasNode);
        });

        it('should correctly map service to SpaceServiceCanvasNode', () => {
            expect(canvasNodeComponents.service).toBe(SpaceServiceCanvasNode);
        });
    });

    describe('Inspector Mapping (Space Canvas Sidebar)', () => {
        const renderSidebarWithNode = (type: string) => {
            const nodeInfo = {
                id: 'test-node-1',
                type: type,
                data: {
                    label: `Test ${type}`,
                    type: type,
                },
                position: { x: 0, y: 0 }
            } as SpaceCanvasNodeInformation;

            return render(
                <SpaceCanvasRightSidebarView 
                    currentlySelectedNodeInformation={nodeInfo}
                    effectiveNodeType={type}
                    isNodeSelectedRepresentingAZone={false}
                    handleStatusChange={vi.fn()}
                    handleArtifactStatusChange={vi.fn()}
                    handlePropertyChange={vi.fn()}
                    canvasNodes={[]}
                />
            );
        };

        it('should render SpaceAgentNodeInspector when agent node is selected', () => {
            renderSidebarWithNode('agent');
            expect(screen.getByTestId('agent-inspector')).toBeInTheDocument();
        });

        it('should render SpaceCrewNodeInspector when crew node is selected', () => {
            renderSidebarWithNode('crew');
            expect(screen.getByTestId('crew-inspector')).toBeInTheDocument();
        });

        it('should render SpaceTemplateNodeInspector when template node is selected', () => {
            renderSidebarWithNode('template');
            expect(screen.getByTestId('template-inspector')).toBeInTheDocument();
        });

        it('should render SpaceAutomationNodeInspector when automation node is selected', () => {
            renderSidebarWithNode('automation');
            expect(screen.getByTestId('automation-inspector')).toBeInTheDocument();
        });

        it('should render SpaceServiceNodeInspector when service node is selected', () => {
            renderSidebarWithNode('service');
            expect(screen.getByTestId('service-inspector')).toBeInTheDocument();
        });
    });
});
