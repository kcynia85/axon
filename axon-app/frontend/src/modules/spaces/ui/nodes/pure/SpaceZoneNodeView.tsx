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
        
        <div 
            className={`${viewModel.containerClassName} node-container`}
            style={{
                ...((viewModel as any).style || {}),
                '--zone-border-color': viewModel.labelBorderClassName?.includes('purple') ? 'rgb(88, 28, 135)' : // purple-900
                                     viewModel.labelBorderClassName?.includes('blue') ? 'rgb(30, 58, 138)' :   // blue-900
                                     viewModel.labelBorderClassName?.includes('pink') ? 'rgb(131, 24, 67)' :   // pink-900
                                     viewModel.labelBorderClassName?.includes('green') ? 'rgb(20, 83, 45)' :   // green-900
                                     viewModel.labelBorderClassName?.includes('yellow') ? 'rgb(113, 63, 18)' : // yellow-900
                                     viewModel.labelBorderClassName?.includes('orange') ? 'rgb(124, 45, 18)' : // orange-900
                                     '#27272a',
                '--zone-text-color': viewModel.labelClassName?.includes('purple') ? 'rgb(192, 132, 252)' : // purple-400
                                    viewModel.labelClassName?.includes('blue') ? 'rgb(96, 165, 250)' :    // blue-400
                                    viewModel.labelClassName?.includes('pink') ? 'rgb(244, 114, 182)' :    // pink-400
                                    viewModel.labelClassName?.includes('green') ? 'rgb(74, 222, 128)' :   // green-400
                                    viewModel.labelClassName?.includes('yellow') ? 'rgb(250, 204, 21)' :  // yellow-400
                                    viewModel.labelClassName?.includes('orange') ? 'rgb(251, 146, 60)' :  // orange-400
                                    '#a1a1aa',
                borderColor: 'var(--zone-border-color)'
            } as React.CSSProperties}
        >
            <div className="nodrag absolute inset-0 z-0 rounded-[inherit]" />

            <div className="absolute -top-4 left-8 z-10 node-zone-label">
                <div 
                    className="flex items-center gap-2 px-4 py-1.5 bg-zinc-950 border-2 rounded-xl  cursor-move transition-colors group-hover:border-white"
                    style={{ borderColor: 'var(--zone-border-color)' }}
                >
                    <span 
                        className={cn("text-[14px] font-black tracking-tight", viewModel.labelClassName)}
                        style={{ color: 'var(--zone-text-color)' }}
                    >
                        {viewModel.displayName}
                    </span>
                </div>
            </div>
        </div>
    </>
);
