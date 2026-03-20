import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectsBrowserLayoutContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="space-y-8">
        {children}
     </BaseDiv>
);
