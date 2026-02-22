import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Globe, RefreshCw } from "lucide-react";

const zoneColorClasses: Record<string, { border: string, shadow: string, handle: string }> = {
    purple: { border: 'border-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', handle: '!bg-purple-500' },
    blue: { border: 'border-blue-500', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', handle: '!bg-blue-500' },
    pink: { border: 'border-pink-500', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]', handle: '!bg-pink-500' },
    green: { border: 'border-green-500', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', handle: '!bg-green-500' },
    yellow: { border: 'border-yellow-500', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', handle: '!bg-yellow-500' },
};

export const ServiceNode = memo(({ data, selected }: NodeProps) => {
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
                        <Globe size={18} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-black text-white tracking-tight">{data.label}</span>
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">
                            {data.status || 'Active'}
                        </span>
                    </div>
                </CardHeader>
                
                <CardBody className="px-4 pb-5 pt-0 flex flex-col gap-2">
                    <p className="text-[11px] font-bold text-zinc-300 leading-snug">
                        {data.actionName}
                    </p>
                    {data.status === 'in_progress' && (
                        <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                            <RefreshCw size={10} className="animate-spin text-zinc-400" />
                            Processing request...
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

ServiceNode.displayName = 'ServiceNode';


