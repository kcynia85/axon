// frontend/src/modules/spaces/ui/nodes/pure/SpaceAgentNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader, Progress } from "@heroui/react";
import { Bot } from "lucide-react";
import { SpaceAgentViewModel } from '../../../domain/types';

export const SpaceAgentNodeView = ({ viewModel }: { readonly viewModel: SpaceAgentViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardHeader className={viewModel.visual.headerClassName}>
            <div className={viewModel.visual.iconClassName}>
                <Bot size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
            </div>
        </CardHeader>
        
        <CardBody className="px-4 pb-5 pt-0 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-zinc-400 italic">Creating content...</span>
                    <span className="text-[10px] font-black text-white tabular-nums">{viewModel.progressLabel}</span>
                </div>
                <Progress 
                    size="sm" 
                    value={viewModel.progressValue} 
                    classNames={{
                        base: "max-w-full h-1.5 bg-zinc-900 rounded-full",
                        indicator: "bg-zinc-400",
                    }}
                />
            </div>
        </CardBody>
    </Card>
);
