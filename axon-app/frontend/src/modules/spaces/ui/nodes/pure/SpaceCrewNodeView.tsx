// frontend/src/modules/spaces/ui/nodes/pure/SpaceCrewNodeView.tsx

import React from 'react';
import { Cpu, AlertCircle, Play, Users } from "lucide-react";
import { SpaceCrewViewModel } from '@/modules/spaces/domain/types';
import { cn } from "@/shared/lib/utils";

const COLOR_MAP: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "59, 130, 246"
};

export const SpaceCrewNodeView = ({ viewModel }: { readonly viewModel: SpaceCrewViewModel }) => (
    <div 
        className={cn(
            viewModel.visual.containerClassName, 
            "overflow-hidden",
            viewModel.isWorking && "ai-working-node",
            viewModel.isConsultation && "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
        )}
        style={{ '--ai-zone-color': COLOR_MAP[viewModel.zoneColor || "default"] || COLOR_MAP.default } as React.CSSProperties}
    >
        {/* AI Working Shimmer Effect - Background Layer */}
        {viewModel.isWorking && <div className="ai-shimmer-layer" />}

        {/* Content Layer - Isolated from shimmer to prevent jitter */}
        <div className="relative z-10 w-full h-full">
            <div className={cn(
                viewModel.visual.headerClassName,
                "bg-gradient-to-b from-zinc-900/50 to-transparent pb-6"
            )}>
                <div className={cn(
                    viewModel.visual.iconClassName,
                    viewModel.isConsultation && "text-orange-500 border-orange-500/30 bg-orange-500/10"
                )}>
                    {viewModel.isConsultation ? <AlertCircle size={18} /> : <Cpu size={18} />}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                    <span className={cn(
                        viewModel.visual.subtitleClassName,
                        viewModel.isConsultation && "text-orange-500/80 font-black animate-pulse"
                    )}>
                        {viewModel.isConsultation ? 'Human Loop Required' : viewModel.statusText}
                    </span>
                </div>
            </div>
            
            <div className="px-4 pb-5 pt-0 flex flex-col gap-4 node-body -mt-2">
                {/* Protocol Info */}
                <div className="flex items-center gap-2 px-2 py-1.5 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                    <Users size={12} className="text-zinc-500" />
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-[0.1em]">Protocol Active</span>
                    <div className="ml-auto flex -space-x-1.5">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-4 h-4 rounded-full border border-black bg-zinc-800" />
                        ))}
                    </div>
                </div>

                {/* Team List */}
                <div className="space-y-1.5">
                    <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-0.5">Team</h4>
                    <div className="space-y-1">
                        {viewModel.teamRoles?.map((role, i) => {
                            const isActive = viewModel.activeAgentTitle === role;
                            return (
                                <div key={i} className={cn(
                                    "flex items-center justify-between gap-2 px-2 py-1 rounded-md transition-all",
                                    isActive ? "bg-zinc-200/5 border border-zinc-200/10" : "hover:bg-zinc-200/5"
                                )}>
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={cn(
                                            "w-1 h-1 rounded-full",
                                            isActive ? "bg-white animate-pulse" : "bg-zinc-700"
                                        )} />
                                        <span className={cn(
                                            "text-[10px] font-bold truncate",
                                            isActive ? "text-white" : "text-zinc-400"
                                        )}>
                                            {role}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Consultation Alert */}
                {viewModel.isConsultation && (
                    <button 
                        className="w-full h-9 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] border-none cursor-pointer flex items-center justify-center gap-2"
                    >
                        <Play size={14} fill="white" /> Enter Conversation
                    </button>
                )}

                {/* Progress Bar (if active) */}
                {(viewModel.isWorking || viewModel.isDone) && !viewModel.isConsultation && (
                    <div className="flex flex-col gap-2 pt-1">
                        <div className="flex justify-between items-end">
                            <span className="text-[10px] font-bold text-zinc-500 italic">Squad Status</span>
                            <span className="text-[10px] font-black text-white tabular-nums">{viewModel.progressLabel}</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full transition-all duration-500 bg-zinc-200",
                                    viewModel.isWorking && "animate-pulse"
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
