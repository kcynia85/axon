import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const CreateProjectFormScrollArea: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="p-10 space-y-12 overflow-y-auto scrollbar-hide flex-1 pt-12 pb-32">
        {children}
     </BaseDiv>
);
