// frontend/src/modules/spaces/ui/nodes/SpaceTemplateCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapTemplateToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceTemplateNodeView } from './pure/SpaceTemplateNodeView';
import { SpaceCanvasNodeProperties, SpaceTemplateDomainData } from '../../domain/types';

export const SpaceTemplateCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapTemplateToViewModel(
        nodeProperties.data as unknown as SpaceTemplateDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceTemplateNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceTemplateCanvasNode.displayName = 'SpaceTemplateCanvasNode';
