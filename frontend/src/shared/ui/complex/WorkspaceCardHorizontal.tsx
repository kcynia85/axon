import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, ChevronRight, ArrowRight, MoreVertical, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { TagChip } from "@/shared/ui/ui/TagChip";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

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
    readonly onDelete?: (templateId: string) => void; // Expects templateId
    readonly templateId?: string; // Accept templateId prop
    readonly agentIds?: readonly string[];
    readonly agentVisualsMap?: Record<string, string>;
};

/**
 * WorkspaceCardHorizontal - Horizontal version of the workspace resource card.
 * Used for Crews, Templates, Services, and Automations.
 * The "crew" variant provides a "poster" style layout with a black theme.
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
    onDelete, // Expects templateId: string
    templateId, // Accept templateId prop
    agentIds = [],
    agentVisualsMap = {}
}: WorkspaceCardHorizontalProps) => {
    const styles = getVisualStylesForZoneColor(colorName);

    // Helper for description truncation
    const truncatedDescription = description && description.length > 90 
        ? `${description.substring(0, 90)}...` 
        : description;

    const renderActions = () => {
        // Ensure onDelete and templateId are present
        if (!onDelete || !templateId) return null; 
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
                                // Call onDelete with templateId
                                onDelete(templateId as string); 
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

    // --- CREW / POSTER VARIANT ---
    if (variant === "crew") {
        const displayedAgents = agentIds.slice(0, 3);
        const remainingCount = Math.max(0, agentIds.length - 3);

        return (
            <Link 
                href={href} 
                className={cn("group block w-full outline-none h-full", className)}
                onClick={(e) => {
                    if (onEdit) {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent event propagation to avoid conflicts
                        onEdit(e);
                    }
                }}
            >
                <Card className="flex flex-col h-full p-6 border-zinc-200 dark:border-zinc-800 bg-black hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl transition-all rounded-2xl overflow-hidden active:scale-[0.98] relative min-h-[200px] justify-between">
                    
                    {renderActions()}

                    {/* Background Soft Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/20 via-transparent to-transparent pointer-events-none opacity-60 transition-opacity" />

                    {/* TOP ROW: Visual (Left) and Type Chip (Right) */}
                    <div className="flex justify-between items-center z-10 w-full pr-8">
                        {/* Overlapping Avatars or Icon */}
                        <div className="flex items-center transition-transform duration-500 ease-out origin-left">
                            {agentIds.length > 0 ? (
                                <div className="flex -space-x-3 mr-3">
                                    {displayedAgents.map((agentId, i) => {
                                        const imgId = ((agentId.charCodeAt(agentId.length - 1) + i) % 5) + 1;
                                        const avatarUrl = agentVisualsMap[agentId] || `/images/avatars/agent-${imgId}.png`;
                                        return (
                                            <div key={agentId} className={cn(
                                                "w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden shadow-sm relative",
                                                styles.textClassName.replace('text-', 'border-'),
                                                i === 0 ? "z-30" : i === 1 ? "z-20" : "z-10"
                                            )}>
                                                <Image 
                                                    src={avatarUrl} 
                                                    alt={`Agent ${imgId}`}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                />
                                            </div>
                                        );
                                    })}
                                    {remainingCount > 0 && (
                                        <div className="w-10 h-10 flex items-center justify-center text-[13px] font-black tracking-tighter z-40 text-zinc-500 pl-2 border-2 border-transparent">
                                            +{remainingCount}
                                        </div>
                                    )}
                                </div>
                            ) : Icon ? (
                                <div className={cn("w-10 h-10 rounded-xl bg-zinc-900 border flex items-center justify-center shadow-inner", styles.textClassName.replace('text-', 'border-'))}>
                                    <Icon className={cn("w-5 h-5", styles.textClassName)} />
                                </div>
                            ) : (
                                // Fallback deterministic avatars
                                <div className="flex -space-x-3 mr-3">
                                    {[1, 2, 3].map((i) => {
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
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Type Chip */}
                        {badgeLabel && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white border-white px-2.5 py-0.5 rounded-lg text-black">
                                {badgeLabel}
                            </Badge>
                        )}
                    </div>

                    {/* MIDDLE: Name & Description */}
                    <div className="flex-1 flex flex-col items-start justify-center py-4 z-10 pr-10">
                        <h4 className="text-[16px] font-bold text-white group-hover:text-primary transition-colors leading-tight text-left max-w-[95%]">
                            {title}
                        </h4>
                        {description && (
                            <p className="text-[13px] text-zinc-400 line-clamp-2 mt-2 text-left max-w-[95%] font-medium leading-relaxed">
                                {truncatedDescription}
                            </p>
                        )}
                    </div>

                    {/* BOTTOM: Tags */}
                    <div className="flex justify-start w-full z-10 pt-2">
                        <div className="flex flex-wrap gap-2 justify-start">
                            {tags?.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className={cn("absolute bottom-0 left-0 right-0 h-1 z-30", styles.hoverBackgroundClassName)} />
                </Card>
            </Link>
        );
    }

    // --- DEFAULT VARIANT (High quality horizontal row) ---
    return (
        <Link 
            href={href} 
            className={cn("group block w-full outline-none", className)}
            onClick={(e) => {
                if (onEdit) {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(e);
                }
            }}
        >
            <Card className="flex items-start p-5 border-zinc-200 dark:border-zinc-800 bg-black hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative min-h-[120px]">
                
                {renderActions()}

                {/* Visual / Icon */}
                {Icon && (
                    <div className={cn("flex-shrink-0 w-12 h-12 rounded-xl bg-zinc-900 border flex items-center justify-center mr-4 group-hover:scale-105 transition-transform duration-300", styles.textClassName.replace('text-', 'border-'))}>
                        <Icon className={cn("w-6 h-6", styles.textClassName)} />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 pr-10">
                    <div className="flex items-center justify-between mb-1.5 pr-8">
                        <h4 className="text-[16px] font-bold tracking-tight text-white group-hover:text-primary transition-colors truncate pr-2">
                            {title}
                        </h4>
                    </div>
                    {description && (
                        <p className="text-[13px] text-zinc-400 line-clamp-2 leading-relaxed mb-6 font-medium">
                            {truncatedDescription}
                        </p>
                    )}
                    
                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                            {tags.slice(0, 2).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    )}
                    
                    {footerContent && (
                        <div className="mt-3 opacity-60">
                            {footerContent}
                        </div>
                    )}
                </div>

                {/* Bottom Accent Bar */}
                <div className={cn("absolute bottom-0 left-0 right-0 h-1 z-30", styles.hoverBackgroundClassName)} />
            </Card>
        </Link>
    );
};