import React from "react";
import { cn } from "@/shared/lib/utils";
import { BaseHeading3, BaseSpan, BaseParagraph } from "./ProjectBaseAtoms";

export const ProjectTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <BaseHeading3 className={cn("text-base font-bold truncate", className)}>
        {children}
    </BaseHeading3>
);

export const ProjectCardTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseHeading3 className="text-xl font-bold transition-colors group-hover:text-black dark:group-hover:text-white line-clamp-2 leading-tight">
        {children}
    </BaseHeading3>
);

export const ProjectStatusText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseSpan className="text-xs font-medium text-zinc-400">
        {children}
    </BaseSpan>
);

export const ProjectTagText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseSpan className="text-[14px] text-zinc-500 font-medium lowercase whitespace-nowrap truncate block">
        {children}
    </BaseSpan>
);

export const ProjectStatLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseSpan className="text-zinc-500 font-medium tabular-nums">
        {children}
    </BaseSpan>
);

export const ProjectSecondaryText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseParagraph className="text-[10px] text-zinc-400 truncate uppercase tracking-tighter">
        {children}
    </BaseParagraph>
);

export const ProjectGridItemTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseParagraph className="text-xs font-bold truncate group-hover:text-primary transition-colors">
        {children}
    </BaseParagraph>
);

export const MonoText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <BaseSpan className={cn("font-mono", className)}>
        {children}
    </BaseSpan>
);
