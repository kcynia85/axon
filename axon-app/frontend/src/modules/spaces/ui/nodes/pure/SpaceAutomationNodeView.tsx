// frontend/src/modules/spaces/ui/nodes/pure/SpaceAutomationNodeView.tsx

import React from 'react';
import { Zap, FileCode } from "lucide-react";
import { SpaceAutomationViewModel } from '@/modules/spaces/domain/types';
import { cn } from "@/shared/lib/utils";

const getStatusColorClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('done') || s.includes('completed')) return "text-green-500";
    if (s.includes('review') || s.includes('progress')) return "text-blue-400";
    if (s.includes('failed')) return "text-red-500";
    return "text-zinc-600";
};

export const SpaceAutomationNodeView = ({ viewModel }: { readonly viewModel: SpaceAutomationViewModel }) => {
    const { VisualIcon } = viewModel;

    return (
        <div className={cn(
            viewModel.visual.containerClassName,
            "will-change-transform"
        )}>
            <div className={viewModel.visual.headerClassName}>
                <div className={viewModel.visual.iconClassName}>
                    {VisualIcon ? <VisualIcon size={18} /> : <Zap size={18} />}
                </div>
                <div className="flex flex-col gap-0.5">
                    <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                    <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
                </div>
            </div>
        
            <div className="px-4 pb-5 pt-0 node-body">
                {viewModel.hasArtifact && (
                    <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
                        <FileCode size={16} className="text-zinc-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-300 font-mono truncate max-w-[180px]">{viewModel.artifactLabel}</span>
                            <span className={cn(
                                "text-[9px] font-bold uppercase",
                                getStatusColorClass(viewModel.artifactStatusText || "in_review")
                            )}>
                                {viewModel.artifactStatusText || "UNKNOWN"}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
