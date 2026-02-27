// frontend/src/modules/spaces/ui/nodes/pure/SpaceTemplateNodeView.tsx

import React from 'react';
import { LayoutTemplate } from "lucide-react";
import { SpaceTemplateViewModel } from '../../../domain/types';
import { cn } from "@/shared/lib/utils";

export const SpaceTemplateNodeView = ({ viewModel }: { readonly viewModel: SpaceTemplateViewModel }) => (
    <div className={cn(
        viewModel.visual.containerClassName,
        "will-change-transform"
    )}>
        <div className={viewModel.visual.headerClassName}>
            <div className={viewModel.visual.iconClassName}>
                <LayoutTemplate size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
            </div>
        </div>
        
        <div className="px-4 pb-5 pt-0 flex flex-col gap-3 node-body">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Progress</span>
                    <span className="text-[10px] font-black text-zinc-300 font-mono">{viewModel.progressText}</span>
                </div>
                {/* Lightweight Progress Bar */}
                <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-zinc-400 transition-all duration-500"
                        style={{ width: `${viewModel.progressValue}%` }}
                    />
                </div>
            </div>
        </div>
    </div>
);
