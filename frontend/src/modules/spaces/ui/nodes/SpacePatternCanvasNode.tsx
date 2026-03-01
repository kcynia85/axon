// frontend/src/modules/spaces/ui/nodes/SpacePatternCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapPatternToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpacePatternNodeView } from './pure/SpacePatternNodeView';
import { SpacePatternDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

export const SpacePatternCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapPatternToViewModel(
        nodeProperties.data as unknown as SpacePatternDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpacePatternNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpacePatternCanvasNode.displayName = 'SpacePatternCanvasNode';
