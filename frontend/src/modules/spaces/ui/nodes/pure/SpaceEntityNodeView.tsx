// frontend/src/modules/spaces/ui/nodes/pure/SpaceEntityNodeView.tsx

import React from 'react';
import { Card, CardBody, Chip } from "@heroui/react";
import { MoreHorizontal } from "lucide-react";
import { SpaceEntityViewModel } from '../../../domain/types';

export const SpaceEntityNodeView = ({ viewModel }: { readonly viewModel: SpaceEntityViewModel }) => (
    <Card 
        className={viewModel.visual.containerClassName}
    >
        <CardBody className="p-3 node-body">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                     <div className={viewModel.visual.iconClassName}>
                        <viewModel.VisualIcon size={18} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold leading-tight">{viewModel.displayName}</h4>
                        <span className="text-[10px] text-default-400 uppercase tracking-wider font-medium">{viewModel.componentType}</span>
                     </div>
                </div>
                <MoreHorizontal size={16} className="text-default-300" />
            </div>
            
            {viewModel.description && (
                <p className="text-xs text-default-500 line-clamp-2 mb-3">
                    {viewModel.description}
                </p>
            )}

            {viewModel.statusLabel && (
                 <div className="flex items-center gap-2 mt-1">
                     <Chip size="sm" variant="flat" color={viewModel.isStatusActive ? 'success' : 'default'} className="h-5 text-[10px]">
                        {viewModel.statusLabel}
                     </Chip>
                 </div>
            )}
        </CardBody>
    </Card>
);
