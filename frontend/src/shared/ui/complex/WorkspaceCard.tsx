"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, Edit2, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card, CardHeader, CardContent, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { BaseSpan } from "@/modules/projects/features/browse-projects/ui/components/ProjectBaseAtoms";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

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
};

/**
 * WorkspaceCard - Reusable card based on the Spaces overview / MainCard aesthetic.
 * The "agent" variant follows the 2:3 portrait spec but maintains the same size.
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
    onEdit
}: WorkspaceCardProps) => {
    const styles = getVisualStylesForZoneColor(colorName);
    
    // --- AGENT VARIANT (Sketch Match - Simple Horizontal Layout) ---
    if (variant === "agent") {
        return (
            <Link href={href} className={cn("group block h-full outline-none", className)}>
                <Card className="aspect-[2/3] w-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-xl rounded-2xl overflow-hidden active:scale-[0.98] relative">
                    
                    {/* Visual Area (AI Avatar style human) */}
                    <div className="absolute inset-0 z-0 bg-zinc-50 dark:bg-zinc-900/20 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-900/40 transition-colors">
                        {visualArea}
                    </div>

                    {/* Opacity Gradient */}
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-zinc-950 dark:via-zinc-950/90 dark:to-transparent pointer-events-none" />

                    {/* Content Layer (Bottom aligned, centered text) */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 pb-6 z-20 flex flex-col items-center justify-end text-center pointer-events-none h-1/2">
                        
                        <div className="flex flex-col items-center w-full mb-4 mt-auto">
                            {/* 1. Specialization Heading (16px) - Fixed height for up to 2 lines */}
                            <div className="h-[40px] w-full flex items-end justify-center mb-1">
                                <h4 className="text-[16px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors leading-tight text-balance line-clamp-2">
                                    {badgeLabel}
                                </h4>
                            </div>
                            
                            {/* 2. Full Name (14px) - Fixed height */}
                            <div className="h-[20px] w-full flex items-start justify-center">
                                <span className="text-[14px] font-medium text-zinc-500 dark:text-zinc-400 truncate w-full px-2">
                                    {title}
                                </span>
                            </div>
                        </div>

                        {/* 3. Tags (Chips - 14px, max 2) */}
                        <div className="flex flex-wrap justify-center items-start gap-2 h-7 shrink-0 w-full overflow-hidden">
                            {tags?.slice(0, 2).map(tag => (
                                <Badge 
                                    key={tag} 
                                    variant="secondary" 
                                    className="text-[14px] px-3 py-0.5 h-7 bg-zinc-100/90 dark:bg-zinc-800/90 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-700/50 font-medium text-zinc-700 dark:text-zinc-300 not-italic rounded-lg"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Edit Button */}
                    {onEdit && (
                        <div className="absolute top-3 right-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button 
                                variant="secondary" 
                                size="icon" 
                                className="h-7 w-7 rounded-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-sm pointer-events-auto"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onEdit(e);
                                }}
                            >
                                <Edit2 className="w-3 h-3 text-zinc-600 dark:text-zinc-400" />
                            </Button>
                        </div>
                    )}

                    {/* Bottom Accent Bar */}
                    <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity z-30", styles.hoverBackgroundClassName)} />
                </Card>
            </Link>
        );
    }

    // --- DEFAULT VARIANT (MainCard style) ---
    return (
        <Link href={href} className={cn("group block h-full outline-none", className)}>
            <Card className="h-full border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col transition-all group-hover:border-zinc-400 dark:group-hover:border-zinc-600 group-hover:shadow-md rounded-2xl overflow-hidden active:scale-[0.98] relative">
                <CardHeader className="pb-2 pt-4 flex flex-col items-start gap-2">
                    {/* Title Block */}
                    <div className="min-h-[40px] w-full flex items-start">
                        <div className="flex items-start gap-2">
                            {Icon && <Icon className="h-3.5 w-3.5 text-zinc-400 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />}
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
                        <p className="text-[12px] text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    )}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="secondary" className="text-[7px] h-3.5 bg-zinc-100 dark:bg-zinc-800 border-none font-medium italic text-muted-foreground px-1">
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                </CardContent>

                <CardFooter className="py-2.5 flex items-center justify-between border-t border-zinc-50 dark:border-zinc-900 mt-auto px-4 relative">
                    <div className="w-4 h-4" /> 
                    <BaseSpan className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {footerLabel}
                    </BaseSpan>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-black dark:group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                </CardFooter>

                {/* Bottom Accent Bar */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity z-30", styles.hoverBackgroundClassName)} />
            </Card>
        </Link>
    );
};
