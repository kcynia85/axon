// frontend/src/modules/spaces/ui/nodes/SpaceTemplateCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapTemplateToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceTemplateNodeView } from './pure/SpaceTemplateNodeView';
import { SpaceTemplateDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';
import { cn } from "@/shared/lib/utils";

export const SpaceTemplateCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapTemplateToViewModel(
        nodeProperties.data as unknown as SpaceTemplateDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="relative select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={viewModel.visual.handleClassName} 
            />
            
            <SpaceTemplateNodeView viewModel={viewModel} />

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

SpaceTemplateCanvasNode.displayName = 'SpaceTemplateCanvasNode';
