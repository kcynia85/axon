import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";
import { cn } from "@/shared/lib/utils";

/**
 * Vertical Auto Layout (Stack)
 * Direction: Vertical
 * Gap: 4px (default)
 */
export const ProjectCardTitleGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
     <BaseDiv className={cn("flex flex-col gap-1.5 items-start", className)}>
        {children}
     </BaseDiv>
);

/**
 * Horizontal Auto Layout (Row)
 * Direction: Horizontal
 * Spacing: Space Between
 * Align: Center
 */
export const ProjectCardContentLayout: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <BaseDiv className={cn("flex items-center justify-between gap-4 w-full", className)}>
        {children}
    </BaseDiv>
);

/**
 * Horizontal Auto Layout (Tags)
 * Direction: Horizontal
 * Hug Contents -> Fill Container (flex-1)
 */
export const ProjectCardTagsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-2 overflow-hidden flex-nowrap flex-1">
        {children}
     </BaseDiv>
);

/**
 * Horizontal Auto Layout (Stats)
 * Hug Contents (shrink-0)
 */
export const ProjectCardStatsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium shrink-0">
        {children}
     </BaseDiv>
);
