// frontend/src/modules/spaces/ui/nodes/SpaceAutomationCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapAutomationToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceAutomationNodeView } from './pure/SpaceAutomationNodeView';
import { SpaceAutomationDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceAutomationCanvasNode - Container component for automation node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceAutomationCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const automationViewModel = mapAutomationToViewModel(
        nodeProperties.data as unknown as SpaceAutomationDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={automationViewModel.visual.handleClassName} 
            />
            
            <SpaceAutomationNodeView viewModel={automationViewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={automationViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpaceAutomationCanvasNode.displayName = 'SpaceAutomationCanvasNode';
