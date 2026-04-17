// frontend/src/modules/spaces/ui/nodes/pure/SpaceZoneNodeView.tsx

import React from 'react';
import { NodeResizer } from '@xyflow/react';
import { SpaceZoneViewModel } from '@/modules/spaces/domain/types';
import { cn } from "@/shared/lib/utils";

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

            <div className="absolute -top-4 left-8 z-10 node-zone-label">
                <div className={cn(
                    "flex items-center gap-2 px-4 py-1.5 bg-zinc-950/90 border-dashed rounded-xl shadow-2xl backdrop-blur-md cursor-move transition-colors ",
                    // Use the text color class for the border as well, or find a dedicated border class
                    viewModel.labelClassName.split(' ').find(c => c.startsWith('text-'))?.replace('text-', 'border-') || 'border-zinc-800'
                )}>{/* ... */}
                    <span className={cn("text-[14px] font-black tracking-tight", viewModel.labelClassName)}>
                        {viewModel.displayName}
                    </span>
                </div>
            </div>
        </div>
    </>
);
