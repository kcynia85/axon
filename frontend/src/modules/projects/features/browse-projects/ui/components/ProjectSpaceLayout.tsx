import { BaseDiv } from "./ProjectBaseAtoms";
import React from "react";
import { cn } from "@/shared/lib/utils";

export const ProjectSpaceContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="space-y-4 pt-8 border-t border-zinc-100 dark:border-zinc-900">
        {children}
     </BaseDiv>
);

export const ProjectSpaceOptionsGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="grid grid-cols-1 gap-3">
        {children}
     </BaseDiv>
);

export const ProjectSpaceOptionCard: React.FC<{ 
    children: React.ReactNode; 
    isActive: boolean;
    onClick: () => void;
}> = ({ children, isActive, onClick }) => (
     <BaseDiv 
        onClick={onClick}
        className={cn(
            "group cursor-pointer p-6 border-2 transition-all duration-300 ease-out rounded-[1.5rem] relative overflow-hidden",
            isActive 
                ? "border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xl ring-4 ring-zinc-900/10 dark:ring-white/10 translate-y-[-2px]" 
                : "border-zinc-100 dark:border-zinc-800 bg-white dark:bg-black hover:border-zinc-200 dark:hover:border-zinc-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 hover:translate-y-[-1px]"
        )}
    >
        {children}
     </BaseDiv>
);

export const ProjectSpaceOptionLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="relative z-10 flex items-center justify-between gap-4">
        {children}
     </BaseDiv>
);

export const ProjectSpaceOptionInfo: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
     <BaseDiv className={cn("space-y-1", className)}>
        {children}
     </BaseDiv>
);

export const ProjectSpaceExistingSearchWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="relative animate-in slide-in-from-top-2 duration-300">
        {children}
     </BaseDiv>
);

export const ProjectSpaceCheckIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
     <BaseDiv className="animate-in fade-in zoom-in duration-300 shrink-0">
        {children}
     </BaseDiv>
);
