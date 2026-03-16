// frontend/src/modules/spaces/ui/nodes/SpaceZoneCanvasNode.tsx

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapZoneToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceZoneNodeView } from './pure/SpaceZoneNodeView';
import { SpaceZoneDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';
import { Tooltip } from '@heroui/react';

export const SpaceZoneCanvasNode = memo((nodeProperties: SpaceCanvasNodeProperties) => {
    const viewModel = mapZoneToViewModel(
        nodeProperties.data as unknown as SpaceZoneDomainData, 
        nodeProperties.selected ?? false
    );

    const inputPorts = viewModel.ports?.filter(p => p.type === 'input') || [];
    const outputPorts = viewModel.ports?.filter(p => p.type === 'output') || [];

    return (
        <>
            <SpaceZoneNodeView viewModel={viewModel} />

            {/* Render Input Ports on the Left Edge */}
            {inputPorts.length > 0 ? inputPorts.map((port, index) => {
                const topPosition = `${(index + 1) * (100 / (inputPorts.length + 1))}%`;
                return (
                    <div key={port.id}>
                        {/* External Handle: Target (Data coming from outside) */}
                        <Tooltip content={`External Input: ${port.label} (${port.dataType})`} placement="left" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${port.id}-ext`}
                                type="target"
                                position={Position.Left}
                                className={`${viewModel.handleClassName} -left-2`}
                                style={{ top: topPosition }}
                            />
                        </Tooltip>
                        {/* Internal Handle: Source (Data available for internal nodes) */}
                        <Tooltip content={`Internal Source: ${port.label}`} placement="right" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${port.id}-int`}
                                type="source"
                                position={Position.Left}
                                className={`${viewModel.handleClassName} left-0 opacity-50 border-dashed scale-75`}
                                style={{ top: topPosition }}
                            />
                        </Tooltip>
                    </div>
                );
            }) : (
                <Handle
                    type="target"
                    position={Position.Left}
                    className={viewModel.visual.handleClassName}                    style={{ left: -8 }}
                />
            )}

            {/* Render Output Ports on the Right Edge */}
            {outputPorts.length > 0 ? outputPorts.map((port, index) => {
                const topPosition = `${(index + 1) * (100 / (outputPorts.length + 1))}%`;
                return (
                    <div key={port.id}>
                        {/* Internal Handle: Target (Data coming from internal nodes) */}
                        <Tooltip content={`Internal Target: ${port.label}`} placement="left" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${port.id}-int`}
                                type="target"
                                position={Position.Right}
                                className={`${viewModel.handleClassName} right-0 opacity-50 border-dashed scale-75`}
                                style={{ top: topPosition }}
                            />
                        </Tooltip>
                        {/* External Handle: Source (Data sent to outside) */}
                        <Tooltip content={`External Output: ${port.label} (${port.dataType})`} placement="right" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${port.id}-ext`}
                                type="source"
                                position={Position.Right}
                                className={`${viewModel.handleClassName} -right-2`}
                                style={{ top: topPosition }}
                            />
                        </Tooltip>
                    </div>
                );
            }) : (
                <Handle
                    type="source"
                    position={Position.Right}
                    className={viewModel.visual.handleClassName}                    style={{ right: -8 }}
                />
            )}
        </>
    );
});

SpaceZoneCanvasNode.displayName = 'SpaceZoneCanvasNode';
