// frontend/src/modules/spaces/ui/nodes/pure/SpaceServiceNodeView.tsx

import React from 'react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Globe, RefreshCw, FileCode } from "lucide-react";
import { SpaceServiceViewModel } from '../../../domain/types';
import { cn } from "@/shared/lib/utils";

const getStatusColorClass = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('approved') || s.includes('done') || s.includes('completed')) return "text-green-500";
    if (s.includes('review') || s.includes('progress')) return "text-blue-400";
    if (s.includes('failed')) return "text-red-500";
    return "text-zinc-600";
};

export const SpaceServiceNodeView = ({ viewModel }: { readonly viewModel: SpaceServiceViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardHeader className={cn(viewModel.visual.headerClassName, "items-center !py-3 node-header")}>
            <div className={viewModel.visual.iconClassName}>
                <Globe size={18} />
            </div>
            <div className="flex flex-col">
                <span className={viewModel.visual.titleClassName}>{viewModel.displayName}</span>
            </div>
        </CardHeader>

        <CardBody className="px-4 pb-5 pt-0 flex flex-col gap-2 node-body">
            {viewModel.artefacts && viewModel.artefacts.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {viewModel.artefacts.map(art => (
                        <div key={art.id} className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <FileCode size={16} className="text-zinc-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-300 font-mono truncate max-w-[180px]">{art.label}</span>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase",
                                    getStatusColorClass(art.status)
                                )}>
                                    {art.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : viewModel.isProcessing ? (
                <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    <RefreshCw size={10} className="animate-spin text-zinc-400" />
                    Processing request...
                </div>
            ) : null}
        </CardBody>
    </Card>
);
