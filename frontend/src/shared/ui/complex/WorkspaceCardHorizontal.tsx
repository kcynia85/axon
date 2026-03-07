"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { TagChip } from "@/shared/ui/ui/TagChip";
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
    readonly agentIds?: readonly string[];
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
    onEdit,
    agentIds = []
}: WorkspaceCardHorizontalProps) => {
    const styles = getVisualStylesForZoneColor(colorName);

    // Helper for description truncation
    const truncatedDescription = description && description.length > 70 
        ? `${description.substring(0, 70)}...` 
        : description;

    // --- CREW VARIANT (Sketch Match - Plakatowy układ zespołu) ---
    if (variant === "crew") {
        const displayedAgents = agentIds.slice(0, 3);
        const remainingCount = Math.max(0, agentIds.length - 3);

        return (
            <Link href={href} className={cn("group block w-full outline-none h-full", className)}>
                <Card className="flex flex-col h-full p-6 border-zinc-200 dark:border-zinc-800 bg-black hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl transition-all rounded-2xl overflow-hidden active:scale-[0.98] relative min-h-[180px] justify-between">
                    
                    {/* Background Soft Glow (Subtle gradient) */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/20 via-transparent to-transparent pointer-events-none opacity-60 transition-opacity" />

                    {/* TOP ROW: Avatars (Left) and Type Chip (Right) */}
                    <div className="flex justify-between items-center z-10 w-full">
                        {/* Overlapping Avatars Stack (Top Left - using real agent images) */}
                        <div className="flex items-center transition-transform duration-500 ease-out origin-left">
                            <div className="flex -space-x-3 mr-3">
                                {displayedAgents.length > 0 ? (
                                    displayedAgents.map((agentId, i) => {
                                        // Deterministic image selection based on ID
                                        const imgId = ((agentId.charCodeAt(agentId.length - 1) + i) % 5) + 1;
                                        return (
                                            <div key={agentId} className={cn(
                                                "w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden shadow-sm relative",
                                                // Maximum brightness using the text-400 color variant
                                                styles.textClassName.replace('text-', 'border-'),
                                                i === 0 ? "z-30" : i === 1 ? "z-20" : "z-10"
                                            )}>
                                                <Image 
                                                    src={`/images/avatars/agent-${imgId}.png`} 
                                                    alt={`Agent ${imgId}`}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    // Fallback if no agentIds provided (backward compatibility)
                                    [1, 2, 3].map((i) => {
                                        const imgId = ((title.charCodeAt(0) + i) % 5) + 1;
                                        return (
                                            <div key={i} className={cn(
                                                "w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden shadow-sm relative",
                                                styles.textClassName.replace('text-', 'border-'),
                                                i === 1 ? "z-30" : i === 2 ? "z-20" : "z-10"
                                            )}>
                                                <Image 
                                                    src={`/images/avatars/agent-${imgId}.png`} 
                                                    alt={`Agent ${imgId}`}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                />
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {/* Remaining count indicator */}
                            {remainingCount > 0 && (
                                <div className={cn(
                                    "flex items-center justify-center text-[14px] font-bold tracking-tight ml-[-4px] z-40 text-zinc-500"
                                )}>
                                    +{remainingCount}
                                </div>
                            )}
                        </div>

                        {/* Type Crew Chip (Top Right) */}
                        {badgeLabel && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white border-white px-2.5 py-0.5 rounded-lg text-black">
                                {badgeLabel}
                            </Badge>
                        )}
                    </div>

                    {/* MIDDLE: Crew Name & Description (Left Aligned, Shifted Up) */}
                    <div className="flex-1 flex flex-col items-start justify-center py-4 z-10 -translate-y-1 pr-10">
                        <h4 className="text-[16px] font-bold text-white group-hover:text-primary transition-colors leading-tight text-left max-w-[90%]">
                            {title}
                        </h4>
                        {description && (
                            <p className="text-[14px] text-zinc-400 line-clamp-2 mt-1.5 text-left max-w-[90%] font-medium leading-relaxed pb-4">
                                {truncatedDescription}
                            </p>
                        )}
                    </div>

                    {/* BOTTOM: Tags (Left Aligned) - max 2 using TagChip */}
                    <div className="flex justify-start w-full z-10">
                        <div className="flex flex-wrap gap-2 justify-start">
                            {tags?.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    </div>

                    {/* Arrow indicator on hover (consistent with other cards) */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30 flex items-center justify-center">
                        <ArrowRight 
                            size={20} 
                            className="text-white opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                        />
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
            <Card className="flex items-start p-4 border-zinc-200 dark:border-zinc-800 bg-black hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative">
                {/* --- CONTENT --- */}
                <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-[16px] font-bold tracking-tight text-white group-hover:text-primary transition-colors truncate pr-2">
                            {title}
                        </h4>
                    </div>
                    {description && (
                        <p className="text-[14px] text-zinc-400 line-clamp-2 leading-relaxed mb-6">
                            {truncatedDescription}
                        </p>
                    )}
                    
                    {/* Tags - max 2 using TagChip */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {tags.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    )}
                    
                    {footerContent && (
                        <div className="mt-2 opacity-60">
                            {footerContent}
                        </div>
                    )}
                </div>

                {/* --- RIGHT SIDE (Absolutely Centered Arrow) --- */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
                    <ArrowRight 
                        size={16} 
                        className="text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" 
                    />
                </div>

                {/* Bottom Accent Bar */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity z-30", styles.hoverBackgroundClassName)} />
            </Card>
        </Link>
    );
};
