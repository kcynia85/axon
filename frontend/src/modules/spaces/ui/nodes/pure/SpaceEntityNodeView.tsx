// frontend/src/modules/spaces/ui/nodes/pure/SpaceEntityNodeView.tsx

import React from 'react';
import { MoreHorizontal } from "lucide-react";
import { SpaceEntityViewModel } from '../../../domain/types';
import { cn } from "@/shared/lib/utils";

export const SpaceEntityNodeView = ({ viewModel }: { readonly viewModel: SpaceEntityViewModel }) => (
    <div 
        className={cn(
            viewModel.visual.containerClassName,
            "will-change-transform"
        )}
    >
        <div className="p-3 node-body">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                     <div className={viewModel.visual.iconClassName}>
                        <viewModel.VisualIcon size={18} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold leading-tight">{viewModel.displayName}</h4>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">{viewModel.componentType}</span>
                     </div>
                </div>
                <MoreHorizontal size={16} className="text-zinc-600" />
            </div>
            
            {viewModel.description && (
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">
                    {viewModel.description}
                </p>
            )}

            {viewModel.statusLabel && (
                 <div className="flex items-center gap-2 mt-1">
                     <div className={cn(
                         "px-2 py-0.5 rounded-full text-[10px] font-bold",
                         viewModel.isStatusActive ? "bg-green-500/10 text-green-500" : "bg-zinc-800 text-zinc-400"
                     )}>
                        {viewModel.statusLabel}
                     </div>
                 </div>
            )}
        </div>
    </div>
);
