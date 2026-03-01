// frontend/src/modules/spaces/ui/nodes/SpaceServiceCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapServiceToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceServiceNodeView } from './pure/SpaceServiceNodeView';
import { SpaceServiceDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';
import { cn } from "@/shared/lib/utils";

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
                className={cn(
                    viewModel.visual.handleClassName,
                    viewModel.hasOutputArtefacts && viewModel.activeOutputClassName
                )}
            />
        </div>
    );
});

SpaceServiceCanvasNode.displayName = 'SpaceServiceCanvasNode';
