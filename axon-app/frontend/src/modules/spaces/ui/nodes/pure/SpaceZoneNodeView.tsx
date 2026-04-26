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
        
        {/* Label positioned OUTSIDE the node-container to bypass contain:paint */}
        <div className="absolute top-6 left-6 z-[1000] pointer-events-auto">
            <div 
                className="flex items-center gap-2 px-4 py-1.5 bg-zinc-950/80 backdrop-blur-md border-2 rounded-xl cursor-move transition-all group-hover:border-white shadow-2xl"
                style={{ 
                    borderColor: viewModel.labelBorderClassName?.includes('purple') ? 'rgb(88, 28, 135)' : 
                                 viewModel.labelBorderClassName?.includes('blue') ? 'rgb(30, 58, 138)' : 
                                 viewModel.labelBorderClassName?.includes('pink') ? 'rgb(131, 24, 67)' : 
                                 viewModel.labelBorderClassName?.includes('green') ? 'rgb(20, 83, 45)' : 
                                 viewModel.labelBorderClassName?.includes('yellow') ? 'rgb(113, 63, 18)' : 
                                 viewModel.labelBorderClassName?.includes('orange') ? 'rgb(124, 45, 18)' : 
                                 '#27272a' 
                }}
            >
                <span 
                    className={cn("text-[11px] font-black tracking-[0.2em] uppercase", viewModel.labelClassName)}
                    style={{ 
                        color: viewModel.labelClassName?.includes('purple') ? 'rgb(192, 132, 252)' : 
                               viewModel.labelClassName?.includes('blue') ? 'rgb(96, 165, 250)' : 
                               viewModel.labelClassName?.includes('pink') ? 'rgb(244, 114, 182)' : 
                               viewModel.labelClassName?.includes('green') ? 'rgb(74, 222, 128)' : 
                               viewModel.labelClassName?.includes('yellow') ? 'rgb(250, 204, 21)' : 
                               viewModel.labelClassName?.includes('orange') ? 'rgb(251, 146, 60)' : 
                               '#a1a1aa' 
                    }}
                >
                    {viewModel.displayName}
                </span>
            </div>
        </div>

        <div 
            className={`${viewModel.containerClassName} node-container relative`}
            style={{
                ...((viewModel as any).style || {}),
                zIndex: 0,
                '--zone-border-color': viewModel.labelBorderClassName?.includes('purple') ? 'rgb(88, 28, 135)' : // purple-900
                                     viewModel.labelBorderClassName?.includes('blue') ? 'rgb(30, 58, 138)' :   // blue-900
                                     viewModel.labelBorderClassName?.includes('pink') ? 'rgb(131, 24, 67)' :   // pink-900
                                     viewModel.labelBorderClassName?.includes('green') ? 'rgb(20, 83, 45)' :   // green-900
                                     viewModel.labelBorderClassName?.includes('yellow') ? 'rgb(113, 63, 18)' : // yellow-900
                                     viewModel.labelBorderClassName?.includes('orange') ? 'rgb(124, 45, 18)' : // orange-900
                                     '#27272a',
                borderColor: 'var(--zone-border-color)'
            } as React.CSSProperties}
        >
            <div className="nodrag absolute inset-0 z-0 rounded-[inherit]" />
        </div>
    </>
);
