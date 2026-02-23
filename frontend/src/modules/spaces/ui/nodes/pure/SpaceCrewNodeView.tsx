// frontend/src/modules/spaces/ui/nodes/pure/SpaceCrewNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Users, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { SpaceCrewViewModel } from '../../../domain/types';

export const SpaceCrewNodeView = ({ viewModel }: { readonly viewModel: SpaceCrewViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardHeader className="pb-2 pt-3 px-3 flex items-start gap-2">
            <div className={viewModel.visual.iconClassName}>
                <Users size={16} />
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-bold text-default-700 dark:text-default-200">{viewModel.displayName}</span>
                <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">
                    {viewModel.statusText}
                </span>
            </div>
        </CardHeader>

        <Divider className="opacity-50" />

        <CardBody className="p-3">
            <div className="space-y-2 mb-3">
                <p className="text-[10px] uppercase font-bold text-default-400 tracking-wider">Team</p>
                <div className="flex flex-col gap-1">
                    {viewModel.teamRoles.map((role) => (
                        <div key={role} className="flex items-center gap-2 p-1.5 bg-default-50 dark:bg-default-800 rounded border border-default-100 dark:border-default-700">
                            <div className="w-4 h-4 rounded bg-default-200 dark:bg-default-700"></div>
                            <span className="text-xs text-default-700 dark:text-default-300">{role}</span>
                        </div>
                    ))}
                </div>
            </div>

            {viewModel.alertMessage && (
                <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                    <AlertCircle size={12} className="text-zinc-500" />
                    <span>{viewModel.alertMessage}</span>
                </div>
            )}

            {viewModel.isWorking && (
                <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                    <Loader2 size={12} className="animate-spin text-zinc-400" />
                    <span>Executing step...</span>
                </div>
            )}

            {viewModel.isDone && (
                <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                    <CheckCircle2 size={12} className="text-zinc-400" />
                    <span>All tasks completed</span>
                </div>
            )}
        </CardBody>
    </Card>
);
