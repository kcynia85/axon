import React, { forwardRef } from "react";
import Link from "next/link";
import { Button } from "@/shared/ui/ui/Button";
import { ExternalLink, Info, X, Filter, ArrowUpDown } from "lucide-react";
import { BaseSpan, UnstyledButton } from "./ProjectBaseAtoms";
import { cn } from "@/shared/lib/utils";

export const OpenSpaceIcon: React.FC = () => (
    <ExternalLink size={14} className="text-zinc-400 group-hover/btn:text-black dark:group-hover/btn:text-white" />
);

export const DetailsIcon: React.FC = () => (
    <Info size={14} className="text-zinc-400 group-hover/btn:text-black dark:group-hover/btn:text-white" />
);

export const RemoveIcon: React.FC = () => (
    <X className="h-4 w-4 text-zinc-400 group-hover/pill:text-zinc-600 group-hover/x:text-white transition-colors stroke-[3]" />
);

export const ProjectActionOpenSpace: React.FC<{ href: string }> = ({ href }) => (
    <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 group/btn">
        <Link href={href} className="flex items-center gap-2">
            <OpenSpaceIcon />
            Open Space
        </Link>
    </Button>
);

export const ProjectActionDetails: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <Button 
        variant="ghost" 
        size="sm" 
        className="h-8 px-3 text-[10px] font-bold hover:bg-zinc-100 dark:hover:bg-zinc-900 group/btn"
        onClick={onClick}
    >
        <BaseSpan className="flex items-center gap-2">
            <DetailsIcon />
            Details
        </BaseSpan>
    </Button>
);

export const ProjectActionRemoveTag: React.FC<{ onClick: (e: React.MouseEvent) => void }> = ({ onClick }) => (
    <UnstyledButton
        type="button"
        className="p-1 -mr-1 hover:bg-black dark:hover:bg-zinc-800 hover:text-white dark:hover:text-white rounded-full transition-all flex items-center justify-center pointer-events-auto group/x w-fit"
        onClick={onClick}
    >
        <RemoveIcon />
    </UnstyledButton>
);

export const ProjectCardViewDetailsLabel: React.FC = () => (
    <BaseSpan className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
        View Details
    </BaseSpan>
);

export const ProjectsFilterTriggerButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
    ({ onClick }, ref) => (
        <UnstyledButton 
            ref={ref}
            onClick={onClick}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 mb-[-10px] group w-fit"
        >
            <Filter size={14} className="group-hover:scale-110 transition-transform" />
            More Filters
        </UnstyledButton>
    )
);
ProjectsFilterTriggerButton.displayName = "ProjectsFilterTriggerButton";

export const ProjectsSortTriggerButton = forwardRef<HTMLButtonElement, { onClick?: () => void }>(
    ({ onClick }, ref) => (
        <UnstyledButton 
            ref={ref}
            onClick={onClick}
            className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 border-transparent text-zinc-500 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-all pb-2 group w-fit"
        >
            <ArrowUpDown size={14} />
            Sort
        </UnstyledButton>
    )
);
ProjectsSortTriggerButton.displayName = "ProjectsSortTriggerButton";

export const ProjectsViewModeButton: React.FC<{ 
    onClick: () => void; 
    isActive: boolean; 
    children: React.ReactNode;
}> = ({ onClick, isActive, children }) => (
    <UnstyledButton 
        onClick={onClick}
        className={cn(
            "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2 w-fit",
            isActive 
                ? "border-black dark:border-white text-black dark:text-white" 
                : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
        )}
    >
        {children}
    </UnstyledButton>
);
