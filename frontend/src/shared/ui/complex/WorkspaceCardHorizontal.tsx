"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

type WorkspaceCardHorizontalProps = {
    readonly title: string;
    readonly description?: string | null;
    readonly href: string;
    readonly badgeLabel?: string | null;
    readonly tags?: readonly string[];
    readonly icon?: LucideIcon;
    readonly variant?: "default" | "crew";
    readonly footerContent?: React.ReactNode;
    readonly className?: string;
    readonly colorName?: string;
    readonly onEdit?: (e: React.MouseEvent) => void;
};

/**
 * WorkspaceCardHorizontal - Horizontal version of the workspace resource card.
 * Used for Crews, Templates, Services, and Automations.
 */
export const WorkspaceCardHorizontal = ({
    title,
    description,
    href,
    badgeLabel,
    tags,
    icon: Icon,
    variant = "default",
    footerContent,
    className,
    colorName = "default",
    onEdit
}: WorkspaceCardHorizontalProps) => {
    const styles = getVisualStylesForZoneColor(colorName);

    // --- CREW VARIANT (Sketch Match - Plakatowy układ zespołu) ---
    if (variant === "crew") {
        return (
            <Link href={href} className={cn("group block w-full outline-none h-full", className)}>
                <Card className="flex flex-col h-full p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl transition-all rounded-2xl overflow-hidden active:scale-[0.98] relative min-h-[180px] justify-between">
                    
                    {/* Background Soft Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-50/10 via-transparent to-zinc-50/10 dark:from-zinc-900/5 dark:via-transparent dark:to-zinc-900/5 pointer-events-none" />

                    {/* TOP ROW: Avatars (Left) and Type Chip (Right) */}
                    <div className="flex justify-between items-start z-10 w-full">
                        {/* Overlapping Avatars Stack (Top Left - using real agent images) */}
                        <div className="flex -space-x-3 transition-transform duration-500 ease-out origin-left">
                            {[1, 2, 3].map((i) => {
                                // Deterministic image selection based on title
                                const imgId = ((title.charCodeAt(0) + i) % 5) + 1;
                                return (
                                    <div key={i} className={cn(
                                        "w-10 h-10 rounded-full border-2 border-white dark:border-zinc-950 bg-white dark:bg-zinc-900 flex items-center justify-center overflow-hidden shadow-sm relative",
                                        i === 1 ? "z-30" : i === 2 ? "z-20" : "z-10"
                                    )}>
                                        <img 
                                            src={`/images/avatars/agent-${imgId}.png`} 
                                            alt={`Agent ${imgId}`}
                                            className="w-full h-full object-cover brightness-[1.15] contrast-[1.05] group-hover:brightness-[1.22] group-hover:contrast-[1.10] transition-all duration-500"
                                        />
                                    </div>
                                );
                            })}
                        </div>

                        {/* Type Crew Chip (Top Right) */}
                        {badgeLabel && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100/50 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-700 px-2.5 py-0.5 rounded-lg text-zinc-600 dark:text-zinc-400">
                                {badgeLabel}
                            </Badge>
                        )}
                    </div>

                    {/* MIDDLE: Crew Name & Description (Left Aligned, Shifted Up) */}
                    <div className="flex-1 flex flex-col items-start justify-center py-4 z-10 -translate-y-5">
                        <h4 className="text-[16px] font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors leading-tight text-left max-w-[90%]">
                            {title}
                        </h4>
                        {description && (
                            <p className="text-[14px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1.5 text-left max-w-[90%] font-medium leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>

                    {/* BOTTOM: Tags (Left Aligned) */}
                    <div className="flex justify-start w-full z-10">
                        <div className="flex flex-wrap gap-2 justify-start">
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

                    {/* Bottom Accent Bar */}
                    <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity z-30", styles.hoverBackgroundClassName)} />
                </Card>
            </Link>
        );
    }

    // --- DEFAULT VARIANT ---
    return (
        <Link href={href} className={cn("group block w-full outline-none", className)}>
            <Card className="flex items-start gap-2 p-4 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative">
                {/* --- ICON / VISUAL --- */}
                {Icon && (
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                    </div>
                )}

                {/* --- CONTENT --- */}
                <div className="min-w-3 pt-0.5 flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[13px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-primary transition-colors truncate pr-2">
                            {title}
                        </h4>
                        {badgeLabel && (
                            <Badge variant="outline" className="text-[7px] font-black uppercase tracking-widest bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 h-3.5 py-0 px-1 shrink-0">
                                {badgeLabel}
                            </Badge>
                        )}
                    </div>
                    {description && (
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 leading-relaxed">
                            {description}
                        </p>
                    )}
                    
                    {footerContent && (
                        <div className="mt-2 opacity-60">
                            {footerContent}
                        </div>
                    )}
                </div>

                {/* --- RIGHT SIDE --- */}
                <div className="ml-auto pt-1 pl-1 flex items-center">
                    <ChevronRight size={12} className="text-zinc-300 group-hover:text-primary transition-colors transform group-hover:translate-x-0.5" />
                </div>

                {/* Bottom Accent Bar */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity z-30", styles.hoverBackgroundClassName)} />
            </Card>
        </Link>
    );
};
