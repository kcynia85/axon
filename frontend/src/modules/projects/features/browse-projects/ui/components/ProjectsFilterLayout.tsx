import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectsFilterGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="flex items-center gap-2">
        {children}
     </BaseDiv>
);

export const ProjectsFilterDivider: React.FC = () => (
     <BaseDiv className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
);
