import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody } from "@heroui/react";
import { Box, CheckCircle2, Circle } from "lucide-react";

const zoneColors: Record<string, { icon: string, selected: string }> = {
    purple: { 
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400", 
        selected: "!border-purple-500 !ring-purple-500/20" 
    },
    blue: { 
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", 
        selected: "!border-blue-600 !ring-blue-600/20" 
    },
    pink: { 
        icon: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400", 
        selected: "!border-pink-600 !ring-pink-600/20" 
    },
    green: { 
        icon: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400", 
        selected: "!border-green-600 !ring-green-600/20" 
    },
    yellow: { 
        icon: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400", 
        selected: "!border-yellow-600 !ring-yellow-600/20" 
    },
    orange: { 
        icon: "bg-orange-100 text-orange-600 dark:bg-orange-900/50 dark:text-orange-400", 
        selected: "!border-orange-500 !ring-orange-500/20" 
    },
    default: {
        icon: "bg-default-100 text-default-600 dark:bg-default-800 dark:text-default-400",
        selected: "!border-blue-600 !ring-blue-600/20"
    }
};

export const PatternNode = memo(({ data, selected }: NodeProps) => {
    const zoneColor = data.zoneColor || 'default';
    const colorStyles = zoneColors[zoneColor as keyof typeof zoneColors] || zoneColors.default;

    return (
        <>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-default-400" />
            
            <Card className={`w-[260px] border-2 transition-all ${selected ? `${colorStyles.selected} !ring-2` : 'border-default-200'} !bg-white dark:!bg-[#0f0f0f] shadow-sm`}>
                <CardBody className="p-3">
                     <div className="flex items-center gap-2 mb-3">
                         <div className={`w-8 h-8 rounded-lg border border-default-100 dark:border-default-700 flex items-center justify-center ${colorStyles.icon}`}>
                            <Box size={18} />
                         </div>
                         <div>
                            <h4 className="text-sm font-bold leading-tight dark:text-default-100">{data.label}</h4>
                            <span className="text-[10px] text-default-400 uppercase tracking-wider font-medium">Standard Pattern</span>
                         </div>
                    </div>
                    
                    <div className="space-y-1.5 pl-1">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 size={12} className="text-green-500" />
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

            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-default-400" />
        </>
    );
});
