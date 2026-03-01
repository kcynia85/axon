import React from "react";
import { BaseDiv } from "./ProjectBaseAtoms";

export const ProjectsActionsGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="flex items-center gap-6 mb-[-10px]">
        {children}
    </BaseDiv>
);

export const ProjectsViewSwitcherLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="flex items-center gap-6">
        {children}
    </BaseDiv>
);
