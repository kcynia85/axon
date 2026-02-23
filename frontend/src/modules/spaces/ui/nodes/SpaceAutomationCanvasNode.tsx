// frontend/src/modules/spaces/ui/nodes/SpaceAutomationCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapAutomationToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceAutomationNodeView } from './pure/SpaceAutomationNodeView';
import { SpaceCanvasNodeProperties, SpaceAutomationDomainData } from '../../domain/types';

export const SpaceAutomationCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapAutomationToViewModel(
        nodeProperties.data as unknown as SpaceAutomationDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceAutomationNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={viewModel.visual.handleClassName} 
            />
        </div>
    );
});

SpaceAutomationCanvasNode.displayName = 'SpaceAutomationCanvasNode';
