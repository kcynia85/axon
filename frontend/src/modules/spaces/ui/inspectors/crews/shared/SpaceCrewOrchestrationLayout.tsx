// frontend/src/modules/spaces/ui/inspectors/crews/shared/SpaceCrewOrchestrationLayout.tsx

import React from "react";
import { ScrollShadow } from "@heroui/react";

interface SpaceCrewOrchestrationLayoutProps {
  readonly children: React.ReactNode;
  readonly footer?: React.ReactNode;
}

export const SpaceCrewOrchestrationLayout = ({ 
    children, 
    footer 
}: SpaceCrewOrchestrationLayoutProps) => {
  return (
    <div className="flex flex-col h-full">
      <ScrollShadow className="flex-1 p-8">
        {children}
      </ScrollShadow>
      {footer && (
        <div className="p-6 border-t border-zinc-900 bg-black/50 backdrop-blur-md">
          {footer}
        </div>
      )}
    </div>
  );
};
