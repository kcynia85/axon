import React from "react";
import { cn } from "@/shared/lib/utils";

export type SpaceInspectorPanelProperties = {
    readonly children: React.ReactNode;
    readonly className?: string;
};

/**
 * SpaceInspectorPanel - Layout component for inspector sidebar.
 * Adheres to Pure View and full naming conventions.
 */
export const SpaceInspectorPanel = ({ children, className: containerClassName }: SpaceInspectorPanelProperties) => {
    return (
        <div className={cn("w-full h-full flex flex-col bg-zinc-950  border-l border-zinc-800", containerClassName)}>
            {children}
        </div>
    );
};
