import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectListItemInfoLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex-1 min-w-0">
        {children}
     </BaseDiv>
);

export const ProjectListItemTitleRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        {children}
     </BaseDiv>
);

export const ProjectListItemTagsRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex flex-wrap gap-2 mt-1">
        {children}
     </BaseDiv>
);
