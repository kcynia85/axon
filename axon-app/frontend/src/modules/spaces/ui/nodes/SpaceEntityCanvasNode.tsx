// frontend/src/modules/spaces/ui/nodes/SpaceEntityCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapEntityToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceEntityNodeView } from './pure/SpaceEntityNodeView';
import { SpaceEntityDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceEntityCanvasNode - Container component for entity node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceEntityCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const entityViewModel = mapEntityToViewModel(
        nodeProperties.data as unknown as SpaceEntityDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={entityViewModel.visual.handleClassName} 
            />
            
            <SpaceEntityNodeView viewModel={entityViewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={entityViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpaceEntityCanvasNode.displayName = 'SpaceEntityCanvasNode';
