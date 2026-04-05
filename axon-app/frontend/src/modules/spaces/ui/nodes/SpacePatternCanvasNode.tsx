// frontend/src/modules/spaces/ui/nodes/SpacePatternCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapPatternToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpacePatternNodeView } from './pure/SpacePatternNodeView';
import { SpacePatternDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpacePatternCanvasNode - Container component for pattern node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpacePatternCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const patternViewModel = mapPatternToViewModel(
        nodeProperties.data as unknown as SpacePatternDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={patternViewModel.visual.handleClassName} 
            />
            
            <SpacePatternNodeView viewModel={patternViewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={patternViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpacePatternCanvasNode.displayName = 'SpacePatternCanvasNode';
