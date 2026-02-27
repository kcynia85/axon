// frontend/src/modules/spaces/ui/nodes/pure/SpacePatternNodeView.tsx

import React from 'react';
import { Card, CardBody } from "@heroui/react";
import { Box, CheckCircle2, Circle } from "lucide-react";
import { SpacePatternViewModel } from '../../../domain/types';

export const SpacePatternNodeView = ({ viewModel }: { readonly viewModel: SpacePatternViewModel }) => (
    <Card className={viewModel.visual.containerClassName}>
        <CardBody className="p-3 node-body">
             <div className="flex items-center gap-2 mb-3">
                 <div className={`w-8 h-8 rounded-lg border border-default-100 dark:border-default-700 flex items-center justify-center ${viewModel.iconBackgroundClassName}`}>
                    <Box size={18} />
                 </div>
                 <div>
                    <h4 className="text-sm font-bold leading-tight dark:text-default-100">{viewModel.displayName}</h4>
                    <span className="text-[10px] text-default-400 uppercase tracking-wider font-medium">{viewModel.categoryText}</span>
                 </div>
            </div>
            
            <div className="space-y-1.5 pl-1">
                <div className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-zinc-400" />
                    <span className="text-xs text-default-600 dark:text-default-500 line-through decoration-default-400">Extract Key Insights</span>
                </div>
                <div className="flex items-center gap-2">
                    <Circle size={12} className="text-default-300 dark:text-default-600" />
                    <span className="text-xs text-default-800 dark:text-default-200 font-medium">Identify User Pains</span>
                </div>
                 <div className="flex items-center gap-2">
                    <Circle size={12} className="text-default-300 dark:text-default-600" />
                    <span className="text-xs text-default-400 dark:text-default-600">Generate Summary</span>
                </div>
            </div>
        </CardBody>
    </Card>
);
