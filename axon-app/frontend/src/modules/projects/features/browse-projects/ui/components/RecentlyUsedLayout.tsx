import React from "react";
import { cn } from "@/shared/lib/utils";
import { ArrowRight, Clock, FolderOpen } from "lucide-react";
import { BaseDiv, BaseHeading3, BaseParagraph, UnstyledButton } from "./ProjectBaseAtoms";

export const RecentlyUsedContainer: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <BaseDiv className={cn("space-y-3", className)}>
        {children}
    </BaseDiv>
);

export const RecentlyUsedHeaderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="flex items-center justify-between px-1">
        {children}
    </BaseDiv>
);

export const RecentlyUsedHeaderTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseHeading3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
        {children}
    </BaseHeading3>
);

export const RecentlyUsedIcon: React.FC = () => (
    <Clock size={12} />
);

export const RecentlyUsedItemLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="flex items-center gap-3 p-3 rounded-xl border border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-900/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all">
        {children}
    </BaseDiv>
);

export const RecentlyUsedItemIconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        {children}
    </BaseDiv>
);

export const RecentlyUsedItemIcon: React.FC = () => (
    <FolderOpen size={16} />
);

export const RecentlyUsedItemInfo: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseDiv className="flex-1 min-w-0">
        {children}
    </BaseDiv>
);

export const RecentlyUsedItemTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseParagraph className="text-xs font-bold truncate group-hover:text-primary transition-colors">
        {children}
    </BaseParagraph>
);

export const RecentlyUsedItemStatus: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BaseParagraph className="text-[10px] text-zinc-400 truncate capitalize tracking-normal">
        {children}
    </BaseParagraph>
);

export const RecentlyUsedItemArrow: React.FC = () => (
    <ArrowRight size={12} className="text-zinc-300 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
);

export const RecentlyUsedButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <UnstyledButton {...props} className={cn("group text-left", props.className)}>
        {children}
    </UnstyledButton>
);
