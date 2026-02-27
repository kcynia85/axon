// frontend/src/modules/spaces/ui/nodes/pure/SpacePatternNodeView.tsx

import React from 'react';
import { Box, CheckCircle2, Circle } from "lucide-react";
import { SpacePatternViewModel } from '../../../domain/types';
import { cn } from "@/shared/lib/utils";

export const SpacePatternNodeView = ({ viewModel }: { readonly viewModel: SpacePatternViewModel }) => (
    <div className={cn(
        viewModel.visual.containerClassName,
        "will-change-transform"
    )}>
        <div className="p-3 node-body">
             <div className="flex items-center gap-2 mb-3">
                 <div className={cn(
                     "w-8 h-8 rounded-lg border border-zinc-800 flex items-center justify-center",
                     viewModel.iconBackgroundClassName
                 )}>
                    <Box size={18} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold leading-tight text-zinc-100">{viewModel.displayName}</h4>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{viewModel.categoryText}</span>
                 </div>
            </div>
            
            <div className="space-y-1.5 pl-1">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-zinc-400" />
                    <span className="text-xs text-zinc-500 line-through decoration-zinc-600">Extract Key Insights</span>
                </div>
                <div className="flex items-center gap-2">
                    <Circle size={12} className="text-zinc-600" />
                    <span className="text-xs text-zinc-200 font-medium">Identify User Pains</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Circle size={12} className="text-zinc-600" />
                    <span className="text-xs text-zinc-500">Generate Summary</span>
                </div>
            </div>
        </div>
    </div>
);
