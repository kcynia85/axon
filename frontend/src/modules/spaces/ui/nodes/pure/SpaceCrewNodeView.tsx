// frontend/src/modules/spaces/ui/nodes/pure/SpaceCrewNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Users, CheckCircle2, MessageSquare, Activity, ShieldCheck, AlertCircle } from "lucide-react";
import { SpaceCrewViewModel } from '../../../domain/types';
import { cn } from '@/shared/lib/utils';

export const SpaceCrewNodeView = ({ viewModel }: { readonly viewModel: SpaceCrewViewModel }) => (
    <Card className={cn(viewModel.visual.containerClassName, "overflow-hidden")}>
        <CardHeader className="pb-2 pt-4 px-4 flex items-start justify-between">
            <div className="flex items-start gap-3">
                <div className={viewModel.visual.iconClassName}>
                    <Users size={16} />
                </div>
                <div className="flex flex-col">
                    <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                    <span className={viewModel.visual.subtitleClassName}>
                        {viewModel.statusText}
                    </span>
                </div>
            </div>
            {viewModel.isWorking && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mt-1" />}
        </CardHeader>

        <CardBody className="px-4 py-3 space-y-4">
            {/* Progress Section */}
            <div className="space-y-2">
                <div className="flex justify-between items-center px-0.5">
                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Crew Progress</span>
                    <span className="text-[10px] font-mono text-zinc-300">{viewModel.progressLabel}</span>
                </div>
                <Progress 
                    size="sm" 
                    value={viewModel.progressValue} 
                    classNames={{ 
                        indicator: "bg-zinc-200", 
                        base: "bg-zinc-900 h-1.5 rounded-full" 
                    }} 
                />
            </div>

            {/* Team List (Vertical as per breadboards) */}
            <div className="space-y-1.5">
                <h4 className="text-[8px] font-black text-zinc-600 uppercase tracking-widest px-0.5">Team</h4>
                <div className="space-y-1">
                    {viewModel.teamRoles.map((role, i) => (
                        <div key={i} className="flex items-center gap-2 group">
                            <div className="w-1 h-1 rounded-full bg-zinc-700 group-hover:bg-zinc-500 transition-colors" />
                            <span className="text-[10px] font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors truncate">
                                {role}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* State Badges */}
            <div className="pt-1">
                {viewModel.isConsultation && (
                    <div className="flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-3 py-2 rounded-xl animate-pulse">
                        <MessageSquare size={12} />
                        <span>Needs Input</span>
                    </div>
                )}

                {viewModel.isWorking && !viewModel.isConsultation && (
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-widest bg-blue-500/10 border border-blue-500/20 px-3 py-2 rounded-xl">
                        <Activity size={12} className="animate-spin" />
                        <span>Orchestrating...</span>
                    </div>
                )}

                {viewModel.isDone && (
                    <div className="flex items-center gap-2 text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-xl">
                        <CheckCircle2 size={12} />
                        <span>Review Artefacts</span>
                    </div>
                )}

                {viewModel.alertMessage && (
                    <div className="flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-xl">
                        <AlertCircle size={12} />
                        <span>{viewModel.alertMessage}</span>
                    </div>
                )}
            </div>
        </CardBody>
    </Card>
);
