import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";

export const ProjectKeywordsContainer: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
     <BaseDiv 
        className="flex flex-wrap gap-3 p-5 min-h-[4rem] bg-zinc-50 dark:bg-black rounded-xl border border-zinc-200 dark:border-zinc-700 focus-within:border-zinc-900 dark:focus-within:border-zinc-200 transition-all cursor-text shadow-inner"
        onClick={onClick}
    >
        {children}
     </BaseDiv>
);
