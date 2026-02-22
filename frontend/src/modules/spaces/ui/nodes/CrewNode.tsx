import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { Users, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

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

export const CrewNode = memo(({ data, selected }: NodeProps) => {
    const state = data.state || 'missing_context';
    const zoneColor = data.zoneColor || 'default';
    const colorStyles = zoneColors[zoneColor as keyof typeof zoneColors] || zoneColors.default;

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={`w-3 h-3 !border-zinc-800 !bg-zinc-500`} 
            />
            
            <Card className={`w-[320px] border-2 transition-all ${selected ? `${colorStyles.selected} ${colorStyles.shadow} !ring-2` : 'border-zinc-700'} bg-black`}>
                <CardHeader className="pb-2 pt-3 px-3 flex items-start gap-2">
                    <div className={`p-1.5 rounded-md border border-default-100 dark:border-default-700 ${colorStyles.icon}`}>
                        <Users size={16} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-default-700 dark:text-default-200">{data.label}</span>
                        <span className="text-[10px] text-default-400 uppercase tracking-wider font-bold">
                            {state.replace('_', ' ')}
                        </span>
                    </div>
                </CardHeader>

                <Divider className="opacity-50" />

                <CardBody className="p-3">
                    <div className="space-y-2 mb-3">
                        <p className="text-[10px] uppercase font-bold text-default-400 tracking-wider">Team</p>
                        <div className="flex flex-col gap-1">
                            {['Web Researcher', 'Content Writer'].map((role) => (
                                <div key={role} className="flex items-center gap-2 p-1.5 bg-default-50 dark:bg-default-800 rounded border border-default-100 dark:border-default-700">
                                    <div className="w-4 h-4 rounded bg-default-200 dark:bg-default-700"></div>
                                    <span className="text-xs text-default-700 dark:text-default-300">{role}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {state === 'missing_context' && (
                        <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                            <AlertCircle size={12} className="text-zinc-500" />
                            <span>Missing required context</span>
                        </div>
                    )}

                    {state === 'working' && (
                        <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                            <Loader2 size={12} className="animate-spin text-zinc-400" />
                            <span>Executing step 2/5...</span>
                        </div>
                    )}

                    {state === 'done' && (
                        <div className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-xs bg-default-100 dark:bg-default-800 px-2 py-1.5 rounded mt-1">
                            <CheckCircle2 size={12} className="text-zinc-400" />
                            <span>All tasks completed</span>
                        </div>
                    )}
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

CrewNode.displayName = 'CrewNode';
