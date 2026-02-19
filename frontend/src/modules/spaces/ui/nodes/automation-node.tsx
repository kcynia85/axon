import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Zap, FileJson } from "lucide-react";

const zoneColors: Record<string, { icon: string, selected: string }> = {
    purple: { 
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900/50 dark:text-purple-400", 
        selected: "!border-purple-500 !ring-purple-500/20" 
    },
    blue: { 
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400", 
        selected: "!border-blue-500 !ring-blue-500/20" 
    },
    pink: { 
        icon: "bg-pink-100 text-pink-600 dark:bg-pink-900/50 dark:text-pink-400", 
        selected: "!border-pink-500 !ring-pink-500/20" 
    },
    green: { 
        icon: "bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400", 
        selected: "!border-green-500 !ring-green-500/20" 
    },
    yellow: { 
        icon: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400", 
        selected: "!border-yellow-500 !ring-yellow-500/20" 
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

export const AutomationNode = memo(({ data, selected }: NodeProps) => {
    const state = data.state || 'completed';
    const zoneColor = data.zoneColor || 'default';
    const colorStyles = zoneColors[zoneColor as keyof typeof zoneColors] || zoneColors.default;

    return (
        <>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-default-400" />
            
            <Card className={`w-[260px] border-2 transition-all ${selected ? `${colorStyles.selected} !ring-2` : 'border-default-200'} !bg-white dark:!bg-[#0f0f0f]`}>
                <CardHeader className="pb-2 pt-3 px-3 flex items-start gap-2">
                    <div className={`p-1.5 rounded-md border border-default-100 dark:border-default-700 ${colorStyles.icon}`}>
                        <Zap size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-default-700 dark:text-default-200">{data.label}</span>
                        <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">
                            {state}
                        </span>
                    </div>
                </CardHeader>

                <Divider className="opacity-50" />

                <CardBody className="p-3">
                    {data.artifactName && (
                        <div className="flex items-center gap-2 p-2 bg-default-50 dark:bg-default-800 rounded border border-default-100 dark:border-default-700">
                            <FileJson size={14} className="text-default-500 dark:text-default-400" />
                            <div className="flex flex-col">
                                <span className="text-xs font-mono font-medium text-default-700 dark:text-default-200">{data.artifactName}</span>
                                <span className="text-[10px] text-default-400">Done</span>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-default-400" />
        </>
    );
});
