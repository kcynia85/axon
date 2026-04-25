// frontend/src/modules/spaces/ui/nodes/SpaceCrewCanvasNode.tsx

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { mapCrewToViewModel } from '../mappers/SpaceNodeViewModelMapper';
import { SpaceCrewNodeView } from './pure/SpaceCrewNodeView';
import { SpaceCrewDomainData } from '../../domain/types';
import { SpaceCanvasNodeProperties } from '../types';

/**
 * SpaceCrewCanvasNode - Container component for crew node on the canvas.
 * Orchestrates mapping domain data to view model and rendering the Pure View.
 */
export const SpaceCrewCanvasNode = (nodeProperties: SpaceCanvasNodeProperties & { onRun?: (id: string, input: string) => Promise<void> }) => {
    const crewViewModel = mapCrewToViewModel(
        nodeProperties.data as unknown as SpaceCrewDomainData, 
        nodeProperties.selected ?? false
    );

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={crewViewModel.visual.handleClassName} 
            />
            
            <SpaceCrewNodeView 
                viewModel={crewViewModel} 
                onRun={userInput => nodeProperties.onRun?.(nodeProperties.id, userInput)}
            />

            <Handle 
                type="source" 
                position={Position.Right} 
                className={crewViewModel.visual.handleClassName} 
            />
        </div>
    );
};

SpaceCrewCanvasNode.displayName = 'SpaceCrewCanvasNode';
