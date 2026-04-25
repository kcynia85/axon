// frontend/src/modules/spaces/ui/nodes/SpaceAgentCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapAgentToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceAgentNodeView } from './pure/SpaceAgentNodeView';
import { SpaceAgentDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceAgentCanvasNode - Container component for agent node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceAgentCanvasNode = React.memo((nodeProperties: SpaceCanvasNodeProperties & { onRun?: (id: string, input: string) => Promise<void> }) => {
    const agentViewModel = mapAgentToViewModel(
        nodeProperties.data as unknown as SpaceAgentDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={agentViewModel.visual.handleClassName} 
            />

            <SpaceAgentNodeView 
                viewModel={agentViewModel} 
                onRun={userInput => nodeProperties.onRun?.(nodeProperties.id, userInput)} 
            />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={agentViewModel.visual.handleClassName} 
            />
        </div>
    );
},
 (prevProps, nextProps) => {
    // Deep equality check for data to prevent re-renders unless data actually changes
    return (
        prevProps.id === nextProps.id &&
        prevProps.selected === nextProps.selected &&
        JSON.stringify(prevProps.data) === JSON.stringify(nextProps.data)
    );
});

SpaceAgentCanvasNode.displayName = 'SpaceAgentCanvasNode';
