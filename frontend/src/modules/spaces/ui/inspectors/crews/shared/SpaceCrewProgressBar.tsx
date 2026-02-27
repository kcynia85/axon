// frontend/src/modules/spaces/ui/inspectors/crews/shared/SpaceCrewProgressBar.tsx

import React from "react";
import { cn } from "@/shared/lib/utils";
import { motion } from "framer-motion";

interface SpaceCrewProgressBarProps {
  readonly progress: number;
  readonly children: React.ReactNode;
  readonly className?: string;
}

export const SpaceCrewProgressBar = ({ 
    progress, 
    children, 
    className 
}: SpaceCrewProgressBarProps) => {
  const hasProgress = progress > 0;

  if (!hasProgress) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className="relative pb-6">
      {/* Vertical Progress Line Container */}
      <div className="absolute left-[4px] top-2 bottom-10 w-[2px] bg-zinc-900 rounded-full">
        {/* Animated Progress Line */}
        <motion.div
          className="absolute top-0 w-full bg-gradient-to-b from-white via-zinc-400 to-transparent shadow-[0_0_15px_rgba(255,255,255,0.4)]"
          initial={{ height: 0 }}
          animate={{ height: `${progress}%` }}
          transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
        
        {/* Flowing particle effect at the tip of progress */}
        <motion.div 
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]"
            animate={{ top: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50, damping: 20 }}
        />
      </div>
      
      {/* Percentage Indicator */}
      <div className="absolute left-[-12px] bottom-0 text-[10px] font-black font-mono text-zinc-600 w-10 text-center uppercase tracking-tighter">
        {progress}<span className="text-[8px] opacity-50">%</span>
      </div>
      
      {/* Content Area (Tasks) */}
      <div className={cn("pl-8", className)}>
        {children}
      </div>
    </div>
  );
};
