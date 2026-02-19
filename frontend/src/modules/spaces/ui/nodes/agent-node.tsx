import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, CardHeader, Divider, Progress } from "@heroui/react";
import { Bot, AlertCircle, CheckCircle2, FileText } from "lucide-react";

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

export const AgentNode = memo(({ data, selected }: NodeProps) => {
    const state = data.state || 'missing_context';
    const zoneColor = data.zoneColor || 'default';
    const colorStyles = zoneColors[zoneColor as keyof typeof zoneColors] || zoneColors.default;

    return (
        <>
            <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-default-400" />
            
            <Card className={`w-[280px] border-2 transition-all ${selected ? `${colorStyles.selected} !ring-2` : 'border-default-200'} !bg-white dark:!bg-[#0f0f0f]`}>
                <CardHeader className="pb-2 pt-3 px-3 flex items-start gap-2">
                    <div className={`p-1.5 rounded-md border border-default-100 dark:border-default-700 ${colorStyles.icon}`}>
                        <Bot size={16} />
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
                    {state === 'missing_context' && (
                        <div className="space-y-2">
                            <p className="text-xs text-default-600 dark:text-default-400 font-medium">Fill in required context</p>
                            {data.missingFields && (
                                <div className="flex flex-col gap-1">
                                    {data.missingFields.map((field: string) => (
                                        <div key={field} className="flex items-center gap-1.5 text-default-600 dark:text-default-400 text-[10px] bg-default-100 dark:bg-default-800 px-2 py-1 rounded">
                                            <AlertCircle size={10} />
                                            <span>Missing: <span className="font-mono">{field}</span></span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {state === 'briefing' && (
                        <div className="text-xs text-default-600 dark:text-default-400">
                            <p>Starting briefing...</p>
                        </div>
                    )}

                    {state === 'working' && (
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-default-600 dark:text-default-400">
                                <span>Creating content...</span>
                                <span>{data.progress || 0}%</span>
                            </div>
                            <Progress size="sm" value={data.progress || 0} color="default" className="bg-default-100 dark:bg-default-800" />
                        </div>
                    )}

                    {state === 'done' && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-default-700 dark:text-default-300 text-xs font-medium">
                                <CheckCircle2 size={14} className="text-green-500" />
                                <span>Task Completed</span>
                            </div>
                            {data.artifactName && (
                                <div className="flex items-center gap-2 p-1.5 bg-default-50 dark:bg-default-800 rounded border border-default-100 dark:border-default-700">
                                    <FileText size={12} className="text-default-500" />
                                    <span className="text-[10px] font-mono text-default-700 dark:text-default-300 truncate">{data.artifactName}</span>
                                </div>
                            )}
                        </div>
                    )}
                </CardBody>
            </Card>

            <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-default-400" />
        </>
    );
});
