import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const RecentlyUsedGridLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {children}
     </BaseDiv>
);
