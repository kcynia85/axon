// frontend/src/modules/spaces/ui/nodes/SpaceEntityCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { SpaceEntityNodeView } from './pure/SpaceEntityNodeView';
import { mapEntityToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceEntityNodeDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

export const SpaceEntityCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapEntityToViewModel(
        nodeProperties.data as unknown as SpaceEntityNodeDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceEntityNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceEntityCanvasNode.displayName = 'SpaceEntityCanvasNode';
