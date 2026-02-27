// frontend/src/modules/spaces/ui/nodes/pure/SpaceAgentNodeView.tsx

import React from 'react';
import { Bot, AlertCircle } from "lucide-react";
import { SpaceAgentViewModel } from '../../../domain/types';
import { cn } from "@/shared/lib/utils";

export const SpaceAgentNodeView = ({ viewModel }: { readonly viewModel: SpaceAgentViewModel }) => (
    <div className={cn(
        viewModel.visual.containerClassName,
        "will-change-transform" // Akceleracja GPU
    )}>
        <div className={viewModel.visual.headerClassName}>
            <div className={viewModel.visual.iconClassName}>
                <Bot size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
            </div>
        </div>
        
        <div className="px-4 pb-5 pt-0 flex flex-col gap-3 node-body">
            {viewModel.isMissingContext && (
                <div className="flex items-center gap-2 py-1">
                    <AlertCircle size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 italic">Fill in context to start...</span>
                </div>
            )}

            {viewModel.isBriefing && (
                <button 
                    className="w-full h-8 bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-white transition-all cursor-pointer border-none outline-none"
                >
                    Start Briefing
                </button>
            )}

            {viewModel.isConsultation && (
                <div className="flex items-center gap-2 py-1 px-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 animate-pulse" />
                    <span className="text-[10px] font-black text-white uppercase tracking-tight">Consultation required</span>
                </div>
            )}

            {(viewModel.isWorking || viewModel.isDone) && (
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-bold text-zinc-400 italic">
                            {viewModel.isDone ? 'Task completed' : 'Creating content...'}
                        </span>
                        <span className="text-[10px] font-black text-white tabular-nums">{viewModel.progressLabel}</span>
                    </div>
                    {/* Lightweight Progress Bar */}
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-500",
                                viewModel.isDone ? "bg-zinc-200" : "bg-zinc-400"
                            )}
                            style={{ width: `${viewModel.progressValue}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
);
