import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, Chip } from "@heroui/react";
import { 
  Bot, 
  Box, 
  Cpu, 
  FileText, 
  Zap,
  MoreHorizontal,
  LucideIcon
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
    agent: Bot,
    pattern: Box,
    crew: Cpu,
    template: FileText,
    automation: Zap,
    service: Zap
};

const zoneColorClasses: Record<string, { border: string, shadow: string, handle: string }> = {
    purple: { border: 'border-purple-500', shadow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]', handle: '!bg-purple-500' },
    blue: { border: 'border-blue-500', shadow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]', handle: '!bg-blue-500' },
    pink: { border: 'border-pink-500', shadow: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]', handle: '!bg-pink-500' },
    green: { border: 'border-green-500', shadow: 'shadow-[0_0_20px_rgba(34,197,94,0.2)]', handle: '!bg-green-500' },
    yellow: { border: 'border-yellow-500', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]', handle: '!bg-yellow-500' },
};

export const EntityNode = memo(({ data, selected }: NodeProps) => {
    const Icon = icons[data.type as string] || Box;
    const isAgent = data.type === 'agent';
    const zoneColor = (data.zoneColor as string) || 'purple';
    const colorStyles = zoneColorClasses[zoneColor] || zoneColorClasses.purple;

    return (
        <div className="select-none">
            <Handle 
                type="target" 
                position={Position.Left} 
                className={`!w-2 !h-2 !border-zinc-800 !bg-zinc-500`} 
            />
            
            <Card 
                className={`w-[240px] border-2 transition-all ${selected ? `${colorStyles.border} ${colorStyles.shadow}` : 'border-zinc-700 shadow-sm'}`}
            >
                <CardBody className="p-3">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAgent ? 'bg-zinc-100 text-zinc-600' : 'bg-default-100 text-default-600'}`}>
                                <Icon size={18} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold leading-tight">{data.label as string}</h4>
                                <span className="text-[10px] text-default-400 uppercase tracking-wider font-medium">{data.type as string}</span>
                             </div>
                        </div>
                        <MoreHorizontal size={16} className="text-default-300" />
                    </div>
                    
                    {data.description && (
                        <p className="text-xs text-default-500 line-clamp-2 mb-3">
                            {data.description as string}
                        </p>
                    )}

                    {isAgent && (
                         <div className="flex items-center gap-2 mt-1">
                             <Chip size="sm" variant="flat" color={data.status === 'active' ? 'success' : 'default'} className="h-5 text-[10px]">
                                {(data.status as string) || 'Idle'}
                             </Chip>
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

EntityNode.displayName = 'EntityNode';
