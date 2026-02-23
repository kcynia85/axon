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
        
        <div className={viewModel.containerClassName}>
            <div className="absolute -top-3 left-10">
                <div className="px-3 py-1 bg-black border border-zinc-800 rounded-md shadow-xl">
                    <span className={viewModel.labelClassName}>
                        {viewModel.displayName}
                    </span>
                </div>
            </div>
        </div>
    </>
);
