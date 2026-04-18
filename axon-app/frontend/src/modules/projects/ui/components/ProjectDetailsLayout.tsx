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
    <BaseDiv className="group cursor-pointer space-y-1">
        {children}
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
