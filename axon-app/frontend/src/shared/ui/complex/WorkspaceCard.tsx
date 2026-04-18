"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Edit2, ChevronRight, ArrowRight, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { TagChip } from "@/shared/ui/ui/TagChip";
import { Button } from "@/shared/ui/ui/Button";
import { BaseSpan } from "@/modules/projects/ui/components/ProjectBaseAtoms";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import { usePendingDeletionsStore } from "../../lib/store/usePendingDeletionsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

type WorkspaceCardProps = {
    readonly title: string;
    readonly description?: string | null;
    readonly href: string;
    readonly badgeLabel?: string | null;
    readonly tags?: readonly string[];
    readonly icon?: LucideIcon;
    readonly variant?: "default" | "agent";
    readonly visualArea?: React.ReactNode;
    readonly footerLabel?: string;
    readonly className?: string;
    readonly colorName?: string;
    readonly onEdit?: (e: React.MouseEvent) => void;
    readonly onDelete?: (id: string) => void;
    readonly onClick?: (e: React.MouseEvent) => void;
    readonly resourceId?: string;
    readonly layout?: "grid" | "list";
    readonly isDraft?: boolean;
    readonly useDirectHoverMenu?: boolean;
}

/**
 * WorkspaceCard - Reusable card based on the Spaces overview / MainCard aesthetic.
 * The "agent" variant handles both Grid (Poster) and List (Horizontal Row) layouts.
 */
export const WorkspaceCard = ({
    title,
    description,
    href,
    badgeLabel,
    tags,
    icon: Icon,
    variant = "default",
    visualArea,
    footerLabel = "Open Details",
    className,
    colorName = "default",
    layout = "grid",
    onEdit,
    onDelete,
    onClick,
    resourceId,
    isDraft = false,
    useDirectHoverMenu = true
}: WorkspaceCardProps) => {
    const isPending = usePendingDeletionsStore((s) => s.isPending(resourceId || ""));
    const styles = getVisualStylesForZoneColor(colorName);

    if (isPending) return null;

    // Helper for description truncation
    const truncatedDescription = description && description.length > 120 
        ? `${description.substring(0, 120)}...` 
        : description;
        
    const renderActions = () => {
        if (!onDelete || !resourceId) return null;

        if (useDirectHoverMenu) {
            return (
                <div className="absolute top-3 right-3 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 bg-black/40 backdrop-blur-sm text-white hover:bg-white/20"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(e); }}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-black/40 backdrop-blur-sm text-red-400 hover:bg-red-500/20 hover:text-red-500"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(resourceId); }}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            );
        }

        return (
            <div className="absolute top-3 right-3 z-40">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="p-1.5 rounded-md hover:bg-white/20 bg-black/40 text-zinc-300 hover:text-white transition-colors backdrop-blur-sm"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                onDelete(resourceId);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };
    
    // --- AGENT VARIANT: GRID (Poster style) ---
    if (variant === "agent" && layout === "grid") {
        return (
            <Link 
                href={href} 
                className={cn("group block h-full outline-none", className)}
                onClick={(e) => {
                    if (onClick) {
                        e.preventDefault();
                        onClick(e);
                    }
                }}
            >
                <Card className="aspect-[1694/2528] w-full border-zinc-200 dark:border-zinc-800 bg-black flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-xl rounded-2xl overflow-hidden active:scale-[0.98] relative">
                    
                    {renderActions()}

                    {/* Draft Badge in corner */}
                    {isDraft && (
                        <div className="absolute top-3 right-3 z-30">
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-500/10 border-zinc-500/20 px-2.5 py-0.5 rounded-lg text-zinc-500 shadow-none shrink-0">
                                Draft
                            </Badge>
                        </div>
                    )}

                    {/* Visual Area (AI Avatar style human) - Always black background */}
                    <div className="absolute inset-0 z-0 bg-black transition-colors">
                        {visualArea}
                    </div>

                    {/* Opacity Gradient - Solid black fading up to ensure text readability */}
                    <div className="absolute inset-x-0 bottom-0 h-[60%] z-10 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none" />

                    {/* Content Layer (Bottom aligned, left-aligned text) */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col items-start justify-end text-left pointer-events-none h-1/2">
                        
                        <div className="flex flex-col items-start w-full mb-4 mt-auto">
                            {/* Role Heading (16px) */}
                            <div className="h-[24px] w-full flex items-end justify-start mb-1">
                                <h4 className="text-[16px] font-bold tracking-tight text-white group-hover:text-primary transition-colors leading-tight whitespace-nowrap truncate w-full capitalize">
                                    {badgeLabel}
                                </h4>
                            </div>
                            
                            {/* 2. Full Name (14px) */}
                            <div className="h-[20px] w-full flex items-start justify-start">
                                <span className="text-[14px] font-medium text-zinc-400 truncate w-full">
                                    {title}
                                </span>
                            </div>
                        </div>

                        {/* 3. Tags (Using reusable TagChip - max 2) */}
                        <div className="flex flex-wrap justify-start items-start gap-2 h-8 shrink-0 w-full overflow-hidden">
                            {tags?.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className={cn(
                        "absolute bottom-0 left-0 right-0 h-1 z-30", 
                        isDraft ? "bg-transparent" : styles.hoverBackgroundClassName
                    )} />
                </Card>
            </Link>
        );
    }

    // --- AGENT VARIANT: LIST (Horizontal Row style) ---
    if (variant === "agent" && layout === "list") {
        return (
            <Link 
                href={href} 
                className={cn("group block w-full outline-none", className)}
                onClick={(e) => {
                    if (onClick) {
                        e.preventDefault();
                        onClick(e);
                    }
                }}
            >
                <Card className="flex flex-row items-stretch p-0 border-zinc-200 dark:border-zinc-800 bg-black hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative min-h-[120px]">
                    
                    {renderActions()}

                    {/* Draft Badge in corner */}
                    {isDraft && (
                        <div className="absolute top-3 right-3 z-30">
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-wider bg-zinc-500/10 border-zinc-500/20 px-1.5 py-0 rounded text-zinc-500 shrink-0 shadow-none">
                                Draft
                            </Badge>
                        </div>
                    )}

                    {/* Left Side: Avatar Box */}
                    {visualArea && (
                        <div className="w-[120px] shrink-0 relative bg-black border-r border-zinc-900 overflow-hidden">
                            <div className="absolute inset-0 grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500">
                                {visualArea}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/20 pointer-events-none" />
                        </div>
                    )}

                    {/* Right Side: Content */}
                    <div className="flex-1 p-5 min-w-0 pr-12 flex flex-col justify-center">
                        <div className="flex flex-col items-start mb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[15px] font-black tracking-tight text-white group-hover:text-primary transition-colors truncate pr-2 capitalize">
                                    {badgeLabel || "AI Agent"}
                                </h4>
                            </div>
                            <span className="text-[13px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                {title}
                            </span>
                        </div>


                        {description && (
                            <p className="text-[13px] text-zinc-400 line-clamp-1 leading-relaxed mb-3 font-medium">
                                {truncatedDescription}
                            </p>
                        )}
                        
                        {/* Tags (max 2 using TagChip) */}
                        {tags && tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {tags.slice(0, 2).map(tag => (
                                    <TagChip key={tag} label={tag} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className={cn(
                        "absolute bottom-0 left-0 right-0 h-1 z-30", 
                        isDraft ? "bg-transparent" : styles.hoverBackgroundClassName
                    )} />
                </Card>
            </Link>
        );
    }

    // --- DEFAULT VARIANT (MainCard style) ---
    return (
        <Link 
            href={href} 
            className={cn("group block h-full outline-none", className)}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    onClick(e);
                }
            }}
        >
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md rounded-2xl overflow-hidden active:scale-[0.98] relative">
                
                {renderActions()}

                <CardHeader className="pb-2 pt-4 flex flex-col items-start gap-2 pr-10">
                    {/* Title Block */}
                    <div className="min-h-[40px] w-full flex items-start">
                        <div className="flex items-start gap-2">
                            {Icon && <Icon className={cn("h-3.5 w-3.5 mt-0.5 shrink-0 transition-colors", isDraft ? "text-zinc-500" : "text-zinc-400 group-hover:text-primary")} />}
                            <h3 className="text-[13px] font-bold leading-tight group-hover:text-primary transition-colors">{title}</h3>
                        </div>
                    </div>
                    
                    {/* Status/Badges Slot */}
                    <div className="flex items-center h-4">
                        {badgeLabel && (
                            <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-3.5 px-1 py-0">
                                {badgeLabel}
                            </Badge>
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex-1 pt-0.5 pb-4">
                    {description && (
                        <p className="text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                            {truncatedDescription}
                        </p>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {tags.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="py-2.5 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto px-4 relative">
                    <div className="w-4 h-4" /> 
                    <BaseSpan className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {footerLabel}
                    </BaseSpan>
                </CardFooter>

                {/* Bottom Accent Bar */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 z-30", 
                    isDraft ? "bg-transparent" : styles.hoverBackgroundClassName
                )} />
            </Card>
        </Link>
    );
};
