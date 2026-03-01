import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectCardTitleGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex flex-col space-y-2">
        {children}
     </BaseDiv>
);

export const ProjectCardTagsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex flex-wrap gap-2">
        {children}
     </BaseDiv>
);

export const ProjectCardStatsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
        {children}
     </BaseDiv>
);
