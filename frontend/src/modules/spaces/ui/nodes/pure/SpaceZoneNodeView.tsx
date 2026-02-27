// frontend/src/modules/spaces/ui/nodes/pure/SpaceZoneNodeView.tsx

import React from 'react';
import { NodeResizer } from '@xyflow/react';
import { SpaceZoneViewModel } from '../../../domain/types';

export const SpaceZoneNodeView = ({ viewModel }: { readonly viewModel: SpaceZoneViewModel }) => (
    <>
        <NodeResizer 
            isVisible={viewModel.isSelected} 
            minWidth={400} 
            minHeight={300}
            lineClassName={viewModel.resizerLineClassName}
            handleClassName={`h-3 w-3 bg-black border-2 ${viewModel.resizerHandleClassName} rounded-sm`}
        />
        
        <div className={`${viewModel.containerClassName} node-container will-change-transform`}>
            {/* 
                Invisible 'nodrag' overlay to prevent accidental dragging of the entire zone 
                when interacting with internal elements, while keeping the background clickable.
            */}
            <div className="nodrag absolute inset-0 z-0 rounded-[inherit]" />

            <div className="absolute -top-3 left-10 z-10 node-zone-label">
                <div className="px-3 py-1 bg-black border border-zinc-800 rounded-md shadow-xl cursor-move">
                    <span className={viewModel.labelClassName}>
                        {viewModel.displayName}
                    </span>
                </div>
            </div>
        </div>
    </>
);
