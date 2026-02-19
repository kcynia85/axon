import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';
import { Card, CardHeader } from "@heroui/react";

export const ZoneNode = memo(({ data, selected }: NodeProps) => {
    // Determine border color based on type (mock logic)
    const borderColor = data.color === 'purple' ? 'border-purple-500' : 
                        data.color === 'blue' ? 'border-blue-500' :
                        data.color === 'pink' ? 'border-pink-500' :
                        'border-default-400';

    return (
        <>
            <NodeResizer 
                isVisible={selected} 
                minWidth={300} 
                minHeight={200}
                lineClassName="border-primary"
                handleClassName="h-3 w-3 bg-white border-2 border-primary rounded"
            />
            <div className={`h-full w-full rounded-2xl border-2 border-dashed ${borderColor} bg-background/5 transition-all p-4 flex flex-col`}>
                <div className="mb-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${data.color ? `text-${data.color}-500` : 'text-default-500'} bg-background/50 px-2 py-1 rounded-md`}>
                        {data.label} ZONE
                    </span>
                </div>
                {/* Zone content area - nodes will be placed on top via ReactFlow parent/child */}
            </div>
        </>
    );
});
