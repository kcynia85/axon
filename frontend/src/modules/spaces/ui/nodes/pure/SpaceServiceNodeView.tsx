// frontend/src/modules/spaces/ui/nodes/pure/SpaceServiceNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Globe, RefreshCw } from "lucide-react";
import { SpaceServiceViewModel } from '../../../domain/types';

export const SpaceServiceNodeView = ({ viewModel }: { readonly viewModel: SpaceServiceViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardHeader className={viewModel.visual.headerClassName}>
            <div className={viewModel.visual.iconClassName}>
                <Globe size={18} />
            </div>
            <div className="flex flex-col gap-0.5">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
                <span className={viewModel.visual.subtitleClassName}>{viewModel.statusText}</span>
            </div>
        </CardHeader>
        
        <CardBody className="px-4 pb-5 pt-0 flex flex-col gap-2">
            <p className="text-[11px] font-bold text-zinc-300 leading-snug">
                {viewModel.actionName}
            </p>
            {viewModel.isProcessing && (
                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    <RefreshCw size={10} className="animate-spin text-zinc-400" />
                    Processing request...
                </div>
            )}
        </CardBody>
    </Card>
);
