// frontend/src/modules/spaces/ui/nodes/SpaceServiceCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapServiceToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceServiceNodeView } from './pure/SpaceServiceNodeView';
import { SpaceCanvasNodeProperties, SpaceServiceDomainData } from '../../domain/types';

export const SpaceServiceCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapServiceToViewModel(
        nodeProperties.data as unknown as SpaceServiceDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceServiceNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceServiceCanvasNode.displayName = 'SpaceServiceCanvasNode';
