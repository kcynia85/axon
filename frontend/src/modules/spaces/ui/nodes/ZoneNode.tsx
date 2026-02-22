import { memo } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from '@xyflow/react';

const ZoneNodeComponent = memo(({ data, selected }: NodeProps) => {
    const color = data.color || (data.type === 'discovery' ? 'purple' : 'blue');
    
    const colorMap: Record<string, string> = {
        purple: 'border-purple-500 text-purple-400',
        blue: 'border-blue-500 text-blue-400',
        pink: 'border-pink-500 text-pink-400',
        green: 'border-green-500 text-green-400',
        yellow: 'border-yellow-500 text-yellow-400',
    };

    const bgMap: Record<string, string> = {
        purple: 'bg-purple-500/5',
        blue: 'bg-blue-500/5',
        pink: 'bg-pink-500/5',
        green: 'bg-green-500/5',
        yellow: 'bg-yellow-500/5',
    };

    const resizerLineMap: Record<string, string> = {
        purple: 'border-purple-500',
        blue: 'border-blue-500',
        pink: 'border-pink-500',
        green: 'border-green-500',
        yellow: 'border-yellow-500',
    };

    const resizerHandleMap: Record<string, string> = {
        purple: 'border-purple-500',
        blue: 'border-blue-500',
        pink: 'border-pink-500',
        green: 'border-green-500',
        yellow: 'border-yellow-500',
    };

    const borderColorClass = colorMap[color as string] || colorMap.blue;
    const bgColorClass = selected ? (bgMap[color as string] || bgMap.blue) : 'bg-transparent';
    const textColorClass = colorMap[color as string]?.split(' ')[1] || 'text-blue-400';
    const lineClass = resizerLineMap[color as string] || resizerLineMap.blue;
    const handleClass = resizerHandleMap[color as string] || resizerHandleMap.blue;
    const handleBgColor = resizerLineMap[color as string] || resizerLineMap.blue;

    return (
        <>
            <NodeResizer 
                isVisible={selected} 
                minWidth={400} 
                minHeight={300}
                lineClassName={lineClass}
                handleClassName={`h-3 w-3 bg-black border-2 ${handleClass} rounded-sm`}
            />
            
            <div className={`
                h-full w-full rounded-[2rem] border-2 border-dashed
                ${borderColorClass.split(' ')[0]}
                ${bgColorClass}
                transition-all p-8 flex flex-col relative group
            `}>
                <div className="absolute -top-3 left-10">
                    <div className="px-3 py-1 bg-black border border-zinc-800 rounded-md shadow-xl">
                        <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${textColorClass}`}>
                            {data.label || 'Unit'}
                        </span>
                    </div>
                </div>
            </div>

            <Handle
                type="target"
                position={Position.Left}
                className={`!w-4 !h-4 !border-2 !border-zinc-800 ${handleBgColor.replace('border-', 'bg-')} !opacity-100 hover:scale-125 transition-all`}
                style={{ left: -8 }}
            />
            <Handle
                type="source"
                position={Position.Right}
                className={`!w-4 !h-4 !border-2 !border-zinc-800 ${handleBgColor.replace('border-', 'bg-')} !opacity-100 hover:scale-125 transition-all`}
                style={{ right: -8 }}
            />
        </>
    );
});

ZoneNodeComponent.displayName = 'ZoneNode';
export const ZoneNode = ZoneNodeComponent;
