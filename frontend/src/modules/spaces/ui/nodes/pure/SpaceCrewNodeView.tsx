// frontend/src/modules/spaces/ui/nodes/pure/SpaceCrewNodeView.tsx

import React from 'react';
import { Users, MessageSquare, AlertCircle } from "lucide-react";
import { SpaceCrewViewModel } from '@/modules/spaces/domain/types';
import { cn } from '@/shared/lib/utils';

const COLOR_MAP: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "168, 85, 247"
};

export const SpaceCrewNodeView = ({ viewModel }: { readonly viewModel: SpaceCrewViewModel }) => (
    <div 
        className={cn(
            viewModel.visual.containerClassName, 
            "overflow-hidden",
            viewModel.isWorking && "ai-working-node",
            viewModel.isConsultation && "border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.15)]"
        )}
        style={{ '--ai-zone-color': COLOR_MAP[viewModel.zoneColor] || COLOR_MAP.default } as React.CSSProperties}
    >
        {/* AI Working Shimmer Effect - Background Layer */}
        {viewModel.isWorking && <div className="ai-shimmer-layer" />}

        {/* Content Layer - Isolated from shimmer to prevent jitter */}
        <div className="relative z-10 w-full h-full">
            <div className="pb-2 pt-4 px-4 flex items-start justify-between node-header">
                <div className="flex items-start gap-3">
                    <div className={cn(
                        viewModel.visual.iconClassName,
                        viewModel.isConsultation && "text-orange-500 border-orange-500/30"
                    )}>
                        {viewModel.isConsultation ? <MessageSquare size={16} /> : <Users size={16} />}
                    </div>
                    <div className="flex flex-col">
                        <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                        <span className={cn(
                            viewModel.visual.subtitleClassName,
                            viewModel.isConsultation && "text-orange-500"
                        )}>
                            {viewModel.statusText}
                        </span>
                    </div>
                </div>
            </div>

            <div className="px-4 py-3 space-y-4 node-body">
                {/* Progress Section */}
                <div className="space-y-2">
                    <div className="flex justify-end items-center px-0.5">
                        <span className="text-[10px] font-mono text-zinc-300">{viewModel.progressLabel}</span>
                    </div>
                    {/* Lightweight Progress Bar */}
                    <div className="bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className={cn(
                                "h-full transition-all duration-1000",
                                viewModel.isConsultation ? "bg-orange-500" : "bg-zinc-200"
                            )}
                            style={{ width: `${viewModel.progressValue}%` }}
                        />
                    </div>
                </div>

                {/* Team List */}
                <div className="space-y-1.5">
                    <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-0.5">Team</h4>
                    <div className="space-y-1">
                        {viewModel.teamRoles.map((role, i) => {
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
                    <div className="pt-2">
                        <div className="flex items-center gap-2 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg animate-pulse">
                            <AlertCircle size={12} className="text-orange-500 shrink-0" />
                            <span className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">
                                Awaiting Input
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
