import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectResourcesContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="space-y-4">
        {children}
     </BaseDiv>
);

export const ProjectResourcesList: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="space-y-4">
        {children}
     </BaseDiv>
);

export const ProjectResourceItem: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex gap-3 group">
        {children}
     </BaseDiv>
);

export const ProjectResourceInputWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="relative flex-1">
        {children}
     </BaseDiv>
);

export const ProjectResourceIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 group-focus-within:text-zinc-900 dark:group-focus-within:text-zinc-100 transition-colors">
        {children}
     </BaseDiv>
);
