// frontend/src/modules/spaces/ui/nodes/SpaceServiceCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapServiceToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceServiceNodeView } from './pure/SpaceServiceNodeView';
import { SpaceServiceDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceServiceCanvasNode - Container component for service node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceServiceCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const serviceViewModel = mapServiceToViewModel(
        nodeProperties.data as unknown as SpaceServiceDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={serviceViewModel.visual.handleClassName} 
            />
            
            <SpaceServiceNodeView viewModel={serviceViewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={serviceViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpaceServiceCanvasNode.displayName = 'SpaceServiceCanvasNode';
