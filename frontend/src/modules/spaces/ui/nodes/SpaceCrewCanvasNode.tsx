// frontend/src/modules/spaces/ui/nodes/SpaceCrewCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapCrewToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceCrewNodeView } from './pure/SpaceCrewNodeView';
import { SpaceCanvasNodeProperties, SpaceCrewDomainData } from '../../domain/types';

export const SpaceCrewCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapCrewToViewModel(
        nodeProperties.data as unknown as SpaceCrewDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceCrewNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceCrewCanvasNode.displayName = 'SpaceCrewCanvasNode';
