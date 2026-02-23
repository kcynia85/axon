// frontend/src/modules/spaces/ui/nodes/SpaceZoneCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapZoneToViewModel } from '../../domain/mappers/SpaceNodeViewModelMapper';
import { SpaceZoneNodeView } from './pure/SpaceZoneNodeView';
import { SpaceCanvasNodeProperties, SpaceZoneDomainData } from '../../domain/types';

export const SpaceZoneCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapZoneToViewModel(
        nodeProperties.data as unknown as SpaceZoneDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <>
            <SpaceZoneNodeView viewModel={viewModel} />

            <Handle
                type="target"
                position={Position.Left}
                className={viewModel.handleClassName}
                style={{ left: -8 }}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={viewModel.handleClassName}
                style={{ right: -8 }}
            />
        </>
    );
});

SpaceZoneCanvasNode.displayName = 'SpaceZoneCanvasNode';
