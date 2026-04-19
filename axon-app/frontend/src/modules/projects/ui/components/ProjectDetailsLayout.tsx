import React from "react";
import { 
    ProjectDetailsContainerProps, 
    ProjectDetailsSectionProps,
    ProjectDetailsLinkProps
} from "../types";
import { BaseDiv, BaseSpan } from "./ProjectBaseAtoms";

export const ProjectDetailsContainer: React.FC<ProjectDetailsContainerProps> = ({ children }) => (
    <BaseDiv className="flex flex-col h-full space-y-6">
        {children}
    </BaseDiv>
);

export const ProjectDetailsSection: React.FC<ProjectDetailsSectionProps> = ({ sectionLabel, children }) => (
    <BaseDiv className="space-y-1">
        <BaseSpan className="text-[10px] font-bold text-zinc-400">{sectionLabel}</BaseSpan>
        {children}
    </BaseDiv>
);

export const ProjectDetailsContentGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-300 outline-none focus-visible:ring-0">
        {children}
    </BaseDiv>
);

export const ProjectDetailsArtifactItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="group cursor-pointer bg-white/5 hover:bg-white/[0.08] border border-white/[0.03] hover:border-white/10 rounded-2xl p-5 transition-all duration-300">
        <div className="flex flex-col space-y-1">
            {children}
        </div>
    </BaseDiv>
);

export const ProjectDetailsLink: React.FC<ProjectDetailsLinkProps> = ({ href, children }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-sm font-bold text-zinc-500 hover:text-black dark:hover:text-white underline underline-offset-4 decoration-zinc-200 dark:decoration-zinc-800 transition-colors"
    >
        {children}
    </a>
);
