import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectListItemActionsGroupDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-6 shrink-0">
        {children}
     </BaseDiv>
);

export const ProjectListItemActionsDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-2">
        {children}
     </BaseDiv>
);

export const ProjectListItemStatsDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="hidden sm:flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
        {children}
     </BaseDiv>
);

export const ProjectListItemContainerDiv: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:shadow-sm transition-all gap-4 group">
        {children}
     </BaseDiv>
);
