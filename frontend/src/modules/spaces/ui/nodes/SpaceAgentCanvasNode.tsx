// frontend/src/modules/spaces/ui/nodes/SpaceAgentCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapAgentToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceAgentNodeView } from './pure/SpaceAgentNodeView';
import { SpaceCanvasNodeProperties, SpaceAgentDomainData } from '../../domain/types';

export const SpaceAgentCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapAgentToViewModel(
        nodeProperties.data as unknown as SpaceAgentDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceAgentNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceAgentCanvasNode.displayName = 'SpaceAgentCanvasNode';
