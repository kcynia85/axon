import React from "react";
import { cn } from "@/shared/lib/utils";

export const ProjectKeywordInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input 
        {...props}
        className={cn(
            "flex-1 bg-transparent border-none text-zinc-900 dark:text-zinc-100 focus:ring-0 text-base font-mono min-w-[200px] h-10 outline-none placeholder:text-zinc-400 dark:placeholder:text-zinc-700 lowercase",
            props.className
        )}
    />
);

export const ProjectSpaceOptionTitle: React.FC<{ children: React.ReactNode; isActive: boolean }> = ({ children, isActive }) => (
    <p className={cn(
        "text-base leading-tight tracking-tight transition-all duration-300",
        isActive ? "font-black" : "font-normal"
    )}>
        {children}
    </p>
);

export const ProjectSpaceOptionSubtitle: React.FC<{ children: React.ReactNode; isActive: boolean }> = ({ children, isActive }) => (
    <p className={cn(
        "text-xs font-black tracking-normal opacity-60 transition-opacity duration-300",
        isActive ? "opacity-80" : "text-zinc-500"
    )}>
        {children}
    </p>
);
