// frontend/src/modules/spaces/ui/nodes/SpaceAutomationCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapAutomationToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceAutomationNodeView } from './pure/SpaceAutomationNodeView';
import { SpaceAutomationDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';
import { cn } from "@/shared/lib/utils";

export const SpaceAutomationCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapAutomationToViewModel(
        nodeProperties.data as unknown as SpaceAutomationDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="relative select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceAutomationNodeView viewModel={viewModel} />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={cn(
                    viewModel.visual.handleClassName,
                    viewModel.hasOutputArtefacts && viewModel.activeOutputClassName
                )} 
            />
        </div>
    );
});

SpaceAutomationCanvasNode.displayName = 'SpaceAutomationCanvasNode';
