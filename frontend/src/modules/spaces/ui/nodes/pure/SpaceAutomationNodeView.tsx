// frontend/src/modules/spaces/ui/nodes/pure/SpaceAutomationNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Zap, FileCode } from "lucide-react";
import { SpaceAutomationViewModel } from '../../../domain/types';

export const SpaceAutomationNodeView = ({ viewModel }: { readonly viewModel: SpaceAutomationViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardHeader className={viewModel.visual.headerClassName}>
            <div className={viewModel.visual.iconClassName}>
                <Zap size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
            </div>
        </CardHeader>
        
        <CardBody className="px-4 pb-5 pt-0">
            {viewModel.hasArtifact && (
                <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                    <FileCode size={16} className="text-zinc-500" />
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-zinc-300 font-mono truncate max-w-[180px]">{viewModel.artifactLabel}</span>
                        <span className="text-[9px] font-bold text-zinc-600 uppercase">{viewModel.artifactStatusText}</span>
                    </div>
                </div>
            )}
        </CardBody>
    </Card>
);
