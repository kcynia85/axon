// frontend/src/modules/spaces/ui/nodes/SpaceZoneCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapZoneToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceZoneNodeView } from './pure/SpaceZoneNodeView';
import { SpaceZoneDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';
import { Tooltip } from '@heroui/react';

/**
 * SpaceZoneCanvasNode - Container component for zone node on the canvas.
 * Handles complex multi-port logic and renders the Pure View.
 */
export const SpaceZoneCanvasNode = (nodeProperties: SpaceCanvasNodeProperties) => {
    const zoneViewModel = mapZoneToViewModel(
        nodeProperties.data as unknown as SpaceZoneDomainData, 
        nodeProperties.selected ?? false
    );

    const inputPorts = zoneViewModel.ports?.filter(portItem => portItem.type === 'input') || [];
    const outputPorts = zoneViewModel.ports?.filter(portItem => portItem.type === 'output') || [];

    return (
        <>
            <SpaceZoneNodeView viewModel={zoneViewModel} />

            {/* Render Input Ports on the Left Edge */}
            {inputPorts.length > 0 ? inputPorts.map((portItem, portIndex) => {
                const verticalPositionInPercentage = `${(portIndex + 1) * (100 / (inputPorts.length + 1))}%`;
                return (
                    <div key={portItem.id}>
                        {/* External Handle: Target (Data coming from outside) */}
                        <Tooltip content={`External Input: ${portItem.label} (${portItem.dataType})`} placement="left" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${portItem.id}-ext`}
                                type="target"
                                position={Position.Left}
                                className={`${zoneViewModel.handleClassName} -left-2`}
                                style={{ top: verticalPositionInPercentage }}
                            />
                        </Tooltip>
                        {/* Internal Handle: Source (Data available for internal nodes) */}
                        <Tooltip content={`Internal Source: ${portItem.label}`} placement="right" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${portItem.id}-int`}
                                type="source"
                                position={Position.Left}
                                className={`${zoneViewModel.handleClassName} left-0 opacity-50 border-dashed scale-75`}
                                style={{ top: verticalPositionInPercentage }}
                            />
                        </Tooltip>
                    </div>
                );
            }) : (
                <Handle
                    type="target"
                    position={Position.Left}
                    className={zoneViewModel.visual.handleClassName}                    style={{ left: -8 }}
                />
            )}

            {/* Render Output Ports on the Right Edge */}
            {outputPorts.length > 0 ? outputPorts.map((portItem, portIndex) => {
                const verticalPositionInPercentage = `${(portIndex + 1) * (100 / (outputPorts.length + 1))}%`;
                return (
                    <div key={portItem.id}>
                        {/* Internal Handle: Target (Data coming from internal nodes) */}
                        <Tooltip content={`Internal Target: ${portItem.label}`} placement="left" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${portItem.id}-int`}
                                type="target"
                                position={Position.Right}
                                className={`${zoneViewModel.handleClassName} right-0 opacity-50 border-dashed scale-75`}
                                style={{ top: verticalPositionInPercentage }}
                            />
                        </Tooltip>
                        {/* External Handle: Source (Data sent to outside) */}
                        <Tooltip content={`External Output: ${portItem.label} (${portItem.dataType})`} placement="right" size="sm" classNames={{ base: "text-[9px] font-bold" }}>
                            <Handle
                                id={`${portItem.id}-ext`}
                                type="source"
                                position={Position.Right}
                                className={`${zoneViewModel.handleClassName} -right-2`}
                                style={{ top: verticalPositionInPercentage }}
                            />
                        </Tooltip>
                    </div>
                );
            }) : (
                <Handle
                    type="source"
                    position={Position.Right}
                    className={zoneViewModel.visual.handleClassName}                    style={{ right: -8 }}
                />
            )}
        </>
    );
};

SpaceZoneCanvasNode.displayName = 'SpaceZoneCanvasNode';
