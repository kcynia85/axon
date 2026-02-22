import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Zap, FileCode } from "lucide-react";

const zoneColorClasses: Record<string, { border: string, shadow: string, handle: string }> = {
    purple: { border: 'border-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', handle: '!bg-purple-500' },
    blue: { border: 'border-blue-500', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', handle: '!bg-blue-500' },
    pink: { border: 'border-pink-500', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]', handle: '!bg-pink-500' },
    green: { border: 'border-green-500', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', handle: '!bg-green-500' },
    yellow: { border: 'border-yellow-500', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', handle: '!bg-yellow-500' },
};

export const AutomationNode = memo(({ data, selected }: NodeProps) => {
    const state = data.state || 'completed';
    const zoneColor = (data.zoneColor as string) || 'purple';
    const colorStyles = zoneColorClasses[zoneColor] || zoneColorClasses.purple;

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={`!w-2 !h-2 !border-zinc-800 !bg-zinc-500`} 
            />
            
            <Card className={`w-[280px] bg-black border-2 transition-all ${selected ? `${colorStyles.border} ${colorStyles.shadow}` : 'border-zinc-700'} rounded-2xl`}>
                <CardHeader className="p-4 flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400">
                        <Zap size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-white tracking-tight">{data.label}</span>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            {state}
                        </span>
                    </div>
                </CardHeader>
                
                <CardBody className="px-4 pb-5 pt-0">
                    {data.artifactName && (
                        <div className="flex items-center gap-3 p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                            <FileCode size={16} className="text-zinc-500" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-zinc-300 font-mono truncate max-w-[180px]">{data.artifactName}</span>
                                <span className="text-[9px] font-bold text-zinc-600 uppercase">Done</span>
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            <Handle 
                type="source" 
                position={Position.Right} 
                className={`!w-2 !h-2 !border-zinc-800 !bg-zinc-500`} 
            />
        </div>
    );
});

AutomationNode.displayName = 'AutomationNode';


