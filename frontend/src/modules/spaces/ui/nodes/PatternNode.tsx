import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody } from "@heroui/react";
import { Box, CheckCircle2, Circle } from "lucide-react";

const zoneColors: Record<string, { icon: string, selected: string, handle: string, shadow: string }> = {
    purple: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-purple-500",
        handle: "!bg-purple-500",
        shadow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]"
    },
    blue: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-blue-500",
        handle: "!bg-blue-500",
        shadow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]"
    },
    pink: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-pink-500",
        handle: "!bg-pink-500",
        shadow: "shadow-[0_0_20_px_rgba(236,72,153,0.2)]"
    },
    green: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-green-500",
        handle: "!bg-green-500",
        shadow: "shadow-[0_0_20_px_rgba(34,197,94,0.2)]"
    },
    yellow: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-yellow-500",
        handle: "!bg-yellow-500",
        shadow: "shadow-[0_0_20_px_rgba(234,179,8,0.2)]"
    },
    orange: { 
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400", 
        selected: "!border-orange-500",
        handle: "!bg-orange-500",
        shadow: "shadow-[0_0_20_px_rgba(249,115,22,0.2)]"
    },
    default: {
        icon: "bg-zinc-900 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-400",
        selected: "!border-blue-600",
        handle: "!bg-blue-600",
        shadow: ""
    }
};

export const PatternNode = memo(({ data, selected }: NodeProps) => {
    const zoneColor = data.zoneColor || 'default';
    const colorStyles = zoneColors[zoneColor as keyof typeof zoneColors] || zoneColors.default;

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={`w-3 h-3 !border-zinc-800 !bg-zinc-500`} 
            />
            
            <Card className={`w-[260px] border-2 transition-all ${selected ? `${colorStyles.selected} ${colorStyles.shadow} !ring-2` : 'border-zinc-700'} bg-black shadow-sm`}>
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

            <Handle 
                type="source" 
                position={Position.Right} 
                className={`w-3 h-3 !border-zinc-800 !bg-zinc-500`} 
            />
        </div>
    );
});

PatternNode.displayName = 'PatternNode';
