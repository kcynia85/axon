import React from "react";
import { motion } from "framer-motion";

export type SpaceCrewProgressBarProperties = {
    readonly progressValue: number;
    readonly colorClassName?: string;
    readonly labelText?: string;
    readonly children?: React.ReactNode;
};

/**
 * SpaceCrewProgressBar - Pure presentation component for showing execution progress.
 */
export const SpaceCrewProgressBar = ({ 
    progressValue, 
    colorClassName = "bg-white", 
    labelText,
    children
}: SpaceCrewProgressBarProperties) => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    {labelText && <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{labelText}</span>}
                    <span className="text-[10px] font-mono text-zinc-400">{progressValue}%</span>
                </div>
                <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <motion.div 
                        className={`absolute inset-y-0 left-0 ${colorClassName}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressValue}%` }}
                        transition={{ type: "spring", stiffness: 50, damping: 20 }}
                    />
                </div>
            </div>
            {children}
        </div>
    );
};
