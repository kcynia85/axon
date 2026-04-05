// frontend/src/modules/spaces/ui/nodes/SpaceTemplateCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapTemplateToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceTemplateNodeView } from './pure/SpaceTemplateNodeView';
import { SpaceTemplateDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceTemplateCanvasNode - Container component for template node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceTemplateCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const templateViewModel = mapTemplateToViewModel(
        nodeProperties.data as unknown as SpaceTemplateDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={templateViewModel.visual.handleClassName} 
            />
            
            <SpaceTemplateNodeView viewModel={templateViewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={templateViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpaceTemplateCanvasNode.displayName = 'SpaceTemplateCanvasNode';
