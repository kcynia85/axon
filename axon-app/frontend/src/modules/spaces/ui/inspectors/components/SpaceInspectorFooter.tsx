import React from "react";
import { cn } from "@/shared/lib/utils";

export type SpaceInspectorFooterProperties = {
    readonly children: React.ReactNode;
    readonly className?: string;
};

/**
 * SpaceInspectorFooter - Fixed footer for inspector actions.
 * Adheres to Pure View and full naming conventions.
 */
export const SpaceInspectorFooter = ({ children, className: containerClassName }: SpaceInspectorFooterProperties) => {
    return (
        <div className={cn("absolute bottom-0 left-0 right-0 p-6 bg-zinc-950 border-t border-zinc-900 z-20 flex justify-center", containerClassName)}>
            {children}
        </div>
    );
};
