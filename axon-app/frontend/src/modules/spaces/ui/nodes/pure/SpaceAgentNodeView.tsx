// frontend/src/modules/spaces/ui/nodes/pure/SpaceAgentNodeView.tsx

import React from 'react';
import Image from 'next/image';
import { Bot, AlertCircle, Sparkles } from "lucide-react";
import { SpaceAgentViewModel } from '@/modules/spaces/domain/types';
import { cn } from "@/shared/lib/utils";

const COLOR_MAP: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "168, 85, 247" // Notion-like purple as default
};

export const SpaceAgentNodeView = ({ viewModel }: { readonly viewModel: SpaceAgentViewModel }) => (
    <div 
        className={cn(
            viewModel.visual.containerClassName,
            viewModel.isWorking && "ai-working-node",
            viewModel.isSelected && viewModel.visual.borderSelectedClassName
        )}
        style={{ '--ai-zone-color': COLOR_MAP[viewModel.zoneColor || "default"] || COLOR_MAP.default } as React.CSSProperties}
    >

        {/* AI Working Shimmer Effect - Background Layer */}
        {viewModel.isWorking && <div className="ai-shimmer-layer" />}

        {/* Content Layer - Isolated from shimmer to prevent jitter */}
        <div className="relative z-10 w-full h-full">
            <div className={cn(viewModel.visual.headerClassName, "!gap-1.5")}>
                {viewModel.visualUrl ? (
                    <div className="w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden  relative border-zinc-700 shrink-0 mr-3">
                        <Image 
                            src={viewModel.visualUrl} 
                            alt={viewModel.displayName}
                            fill
                            sizes="40px"
                            className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                            priority={true}
                        />
                    </div>
                ) : (
                    <div className={cn(viewModel.visual.iconClassName, "shrink-0 mr-3")}>
                        <Bot size={18} />
                    </div>
                )}
                <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className={cn(viewModel.visual.titleClassName, "truncate")}>{viewModel.displayName}</span>
                        {viewModel.knowledgeHubIds && viewModel.knowledgeHubIds.length > 0 && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500 border border-blue-500 text-blue-400">
                                <Sparkles size={10} className="shrink-0" />
                                <span className="text-[8px] font-black">{viewModel.knowledgeHubIds.length}</span>
                            </div>
                        )}
                    </div>
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
                            <span className="text-[10px] font-bold text-zinc-400">
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
    </div>
);
