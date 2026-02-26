// frontend/src/modules/spaces/ui/inspectors/crews/shared/SpaceCrewProgressBar.tsx

import React from "react";
import { cn } from "@/shared/lib/utils";

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
      {/* Vertical Progress Line */}
      <div className="absolute left-[4px] top-2 bottom-8 w-[1px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="w-full bg-white transition-all duration-1000"
          style={{ height: `${progress}%` }}
        />
      </div>
      
      {/* Percentage Indicator at the bottom */}
      <div className="absolute left-[-12px] bottom-0 text-[10px] font-mono text-zinc-500 w-10 text-center">
        {progress}%
      </div>
      
      {/* Content Area (Tasks) */}
      <div className={cn("pl-6", className)}>
        {children}
      </div>
    </div>
  );
};
