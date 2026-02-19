import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardBody, Chip, Avatar } from "@heroui/react";
import { 
  Bot, 
  Box, 
  Cpu, 
  FileText, 
  Zap,
  MoreHorizontal
} from "lucide-react";

const icons: Record<string, any> = {
    agent: Bot,
    pattern: Box,
    crew: Cpu,
    template: FileText,
    automation: Zap,
    service: Zap
};

export const EntityNode = memo(({ data, selected }: NodeProps) => {
    const Icon = icons[data.type as string] || Box;
    const isAgent = data.type === 'agent';

    return (
        <>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-default-400" />
            
            <Card 
                className={`w-[240px] border-2 transition-all ${selected ? 'border-primary shadow-lg ring-2 ring-primary/20' : 'border-default-200 shadow-sm'}`}
            >
                <CardBody className="p-3">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                             <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isAgent ? 'bg-blue-100 text-blue-600' : 'bg-default-100 text-default-600'}`}>
                                <Icon size={18} />
                             </div>
                             <div>
                                <h4 className="text-sm font-bold leading-tight">{data.label}</h4>
                                <span className="text-[10px] text-default-400 uppercase tracking-wider font-medium">{data.type}</span>
                             </div>
                        </div>
                        <MoreHorizontal size={16} className="text-default-300" />
                    </div>
                    
                    {data.description && (
                        <p className="text-xs text-default-500 line-clamp-2 mb-3">
                            {data.description}
                        </p>
                    )}

                    {isAgent && (
                         <div className="flex items-center gap-2 mt-1">
                             <Chip size="sm" variant="flat" color={data.status === 'active' ? 'success' : 'default'} className="h-5 text-[10px]">
                                {data.status || 'Idle'}
                             </Chip>
                         </div>
                    )}
                </CardBody>
            </Card>

            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-default-400" />
        </>
    );
});
