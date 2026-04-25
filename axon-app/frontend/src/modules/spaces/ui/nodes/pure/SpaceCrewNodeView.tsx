// frontend/src/modules/spaces/ui/nodes/pure/SpaceCrewNodeView.tsx

import React from 'react';
import Image from 'next/image';
import { AlertCircle, Play, Users, Sparkles } from "lucide-react";
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
            viewModel.isConsultation && "border-orange-500 [0_0_20px_rgb(0,0,0)]"
        )}
        style={{ '--ai-zone-color': COLOR_MAP[viewModel.zoneColor || "default"] || COLOR_MAP.default } as React.CSSProperties}
    >
        {/* AI Working Shimmer Effect - Background Layer */}
        {viewModel.isWorking && <div className="ai-shimmer-layer" />}

        {/* Content Layer - Isolated from shimmer to prevent jitter */}
        <div className="relative z-10 w-full h-full">
            {/* Process Type Badge - Top Right */}
            <div className="absolute top-3 right-3 z-20">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-zinc-900 border border-zinc-800 text-zinc-500 ">
                    {viewModel.processType || 'Sequential'}
                </div>
            </div>

            <div className={cn(
                viewModel.visual.headerClassName,
                "bg-gradient-to-b from-zinc-900 to-transparent pb-6 !gap-1.5"
            )}>
                <div className="flex items-center transition-transform duration-500 ease-out origin-left -ml-1">
                    {viewModel.agents && viewModel.agents.length > 0 ? (
                        <div className="flex -space-x-3 mr-3">
                            {viewModel.agents.slice(0, 3).map((agent, index) => (
                                <div key={agent.id} className={cn(
                                    "w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden  relative",
                                    "border-zinc-700",
                                    index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                                )}>
                                    {agent.visualUrl ? (
                                        <Image 
                                            src={agent.visualUrl} 
                                            alt={`Agent`}
                                            fill
                                            sizes="40px"
                                            className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                        />
                                    ) : (
                                        <Users size={18} className="text-zinc-500" />
                                    )}
                                </div>
                            ))}
                            {viewModel.agents.length > 3 && (
                                <div className="w-10 h-10 flex items-center justify-center text-[11px] font-black tracking-tighter z-40 text-zinc-500 pl-3 border-2 border-transparent">
                                    +{viewModel.agents.length - 3}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn(
                            viewModel.visual.iconClassName,
                            viewModel.isConsultation 
                                ? "text-orange-500 border-orange-500 bg-orange-500" 
                                : "text-zinc-400 border-zinc-800 bg-zinc-900"
                        )}>
                            {viewModel.isConsultation ? <AlertCircle size={18} /> : <Users size={18} />}
                        </div>
                    )}
                </div>
                <div className="flex flex-col gap-0.5 overflow-hidden">
                    <div className="flex items-center gap-2">
                        <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                        {viewModel.knowledgeHubIds && viewModel.knowledgeHubIds.length > 0 && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-blue-500 border border-blue-500 text-blue-400">
                                <Sparkles size={10} className="shrink-0" />
                                <span className="text-[8px] font-black">{viewModel.knowledgeHubIds.length}</span>
                            </div>
                        )}
                    </div>
                    <span className={cn(
                        viewModel.visual.subtitleClassName,
                        viewModel.isConsultation && "text-orange-500 font-black animate-pulse"
                    )}>
                        {viewModel.isConsultation ? 'Human Loop Required' : viewModel.statusText}
                    </span>
                </div>
            </div>
            
            <div className="px-4 pb-5 pt-0 flex flex-col gap-4 node-body -mt-2">
                {/* Team List */}
                <div className="space-y-1.5">
                    <h4 className="text-[12px] font-black text-zinc-500">Team</h4>
                    <div className="space-y-1">
                        {viewModel.agents?.map((agent, i) => {
                            const isActive = viewModel.activeAgentTitle === agent.title;
                            return (
                                <div key={i} className={cn(
                                    "flex items-center justify-between gap-2 px-2 rounded-md transition-all",
                                    isActive ? "bg-zinc-200 border border-zinc-200" : "hover:bg-zinc-200"
                                )}>
                                    <div className="flex items-center gap-2 truncate">
                                        <div className={cn(
                                            "w-1 h-1 rounded-full",
                                            isActive ? "bg-white animate-pulse" : "bg-zinc-700"
                                        )} />
                                        <span className={cn(
                                            "text-[12px] font-bold truncate",
                                            isActive ? "text-white" : "text-zinc-400"
                                        )}>
                                            {agent.title}
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
                        className="w-full h-9 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-orange-400 transition-all [0_0_15px_rgb(0,0,0)] border-none cursor-pointer flex items-center justify-center gap-2"
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
