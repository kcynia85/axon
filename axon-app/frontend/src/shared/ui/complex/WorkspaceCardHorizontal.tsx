import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LucideIcon, ChevronRight, ArrowRight, MoreVertical, Trash2, Users, Edit2 } from "lucide-react";
import { cn, getDeterministicImgId } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { TagChip } from "@/shared/ui/ui/TagChip";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import { usePendingDeletionsStore } from "../../lib/store/usePendingDeletionsStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";
import { Button } from "@/shared/ui/ui/Button";

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
    readonly onDelete?: (id: string) => void; 
    readonly onClick?: (e: React.MouseEvent) => void;
    readonly resourceId?: string;
    readonly agentIds?: readonly string[];
    readonly agentVisualsMap?: Record<string, string>;
    readonly isDraft?: boolean;
    readonly useDirectHoverMenu?: boolean;
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
    onDelete, 
    onClick,
    resourceId,
    agentIds = [],
    agentVisualsMap = {},
    isDraft = false,
    useDirectHoverMenu = true
}: WorkspaceCardHorizontalProps) => {
    const isPending = usePendingDeletionsStore((state) => state.isPending(resourceId || ""));
    const visualStyles = getVisualStylesForZoneColor(colorName);

    if (isPending) return null;

    // Helper for description truncation
    const truncatedDescription = description && description.length > 300 
        ? `${description.substring(0, 300)}...` 
        : description;

    const renderActions = () => {
        // Ensure onDelete and resourceId are present
        if (!onDelete || !resourceId) return null; 

        if (useDirectHoverMenu) {
            return (
                <div className="absolute top-3 right-3 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 bg-black/60 text-white hover:bg-white/20"
                            onClick={(mouseEvent) => { mouseEvent.preventDefault(); mouseEvent.stopPropagation(); onEdit(mouseEvent); }}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-black/60 text-red-400 hover:bg-red-500/20 hover:text-red-500"
                        onClick={(mouseEvent) => { mouseEvent.preventDefault(); mouseEvent.stopPropagation(); onDelete(resourceId); }}
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
                            onClick={(mouseEvent) => { mouseEvent.preventDefault(); mouseEvent.stopPropagation(); }}
                            className="p-1.5 rounded-md hover:bg-white/20 bg-black/60 text-zinc-300 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {onEdit && (
                            <DropdownMenuItem 
                                onClick={(mouseEvent) => {
                                    mouseEvent.preventDefault();
                                    mouseEvent.stopPropagation();
                                    onEdit(mouseEvent);
                                }}
                            >
                                <ChevronRight className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={(mouseEvent) => {
                                mouseEvent.preventDefault();
                                mouseEvent.stopPropagation();
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

    // --- CREW / POSTER VARIANT ---
    if (variant === "crew") {
        const displayedAgents = agentIds.slice(0, 3);
        const remainingCount = Math.max(0, agentIds.length - 3);

        return (
            <Link 
                href={href} 
                className={cn("group block w-full outline-none h-full", className)}
                onClick={(mouseEvent) => {
                    if (onClick) {
                        mouseEvent.preventDefault();
                        mouseEvent.stopPropagation();
                        onClick(mouseEvent);
                    }
                }}
            >
                <Card className="flex flex-col h-full p-6 border-zinc-200 dark:border-zinc-800 bg-card hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-xl transition-all rounded-2xl overflow-hidden active:scale-[0.98] relative min-h-[200px] justify-between">
                    
                    {renderActions()}

                    {/* Background Soft Glow */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-zinc-900/20 via-transparent to-transparent pointer-events-none opacity-60 transition-opacity" />

                    {/* TOP ROW: Visual Area */}
                    <div className="flex justify-between items-center z-10 w-full">
                        {/* Overlapping Avatars or Icon */}
                        <div className="flex items-center transition-transform duration-500 ease-out origin-left">
                            {agentIds.length > 0 && !isDraft ? (
                                <div className="flex -space-x-3 mr-3">
                                    {displayedAgents.map((agentId, index) => {
                                        const imageIdentifier = getDeterministicImgId(agentId);
                                        const avatarUrl = agentVisualsMap[agentId] || `/images/avatars/agent-${imageIdentifier}.webp`;
                                        return (
                                            <div key={agentId} className={cn(
                                                "w-10 h-10 rounded-full border-2 bg-black flex items-center justify-center overflow-hidden shadow-sm relative",
                                                visualStyles.textClassName.replace('text-', 'border-'),
                                                index === 0 ? "z-30" : index === 1 ? "z-20" : "z-10"
                                            )}>
                                                <Image 
                                                    src={avatarUrl} 
                                                    alt={`Agent`}
                                                    fill
                                                    sizes="40px"
                                                    className="object-cover object-top scale-110 transition-all duration-500 bg-black"
                                                />
                                            </div>
                                        );
                                    })}
                                    {remainingCount > 0 && (
                                        <div className="w-10 h-10 flex items-center justify-center text-[11px] font-black tracking-tighter z-40 text-zinc-500 pl-3 border-2 border-transparent">
                                            +{remainingCount}
                                        </div>
                                    )}
                                </div>
                            ) : Icon ? (
                                <div className={cn(
                                    "w-10 h-10 rounded-xl bg-zinc-900 border flex items-center justify-center shadow-inner", 
                                    isDraft ? "border-zinc-800" : visualStyles.textClassName.replace('text-', 'border-')
                                )}>
                                    <Icon className={cn("w-5 h-5", isDraft ? "text-zinc-500" : visualStyles.textClassName)} />
                                </div>
                            ) : (
                                // Fallback icon when no agents and no specific icon
                                <div className={cn(
                                    "w-10 h-10 rounded-xl bg-zinc-900 border flex items-center justify-center shadow-inner", 
                                    isDraft ? "border-zinc-800" : visualStyles.textClassName.replace('text-', 'border-')
                                )}>
                                    <Users className={cn("w-5 h-5", isDraft ? "text-zinc-500" : visualStyles.textClassName)} />
                                </div>
                            )}
                        </div>

                        {/* Status/Type Badge - Positioned Absolutely in corner */}
                        <div className="absolute top-3 right-3 z-30">
                            {isDraft ? (
                                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-500/10 border-zinc-500/20 px-2.5 py-0.5 rounded-lg text-zinc-500 shadow-none">
                                    Draft
                                </Badge>
                            ) : (
                                badgeLabel && (
                                    <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-white border-white px-2.5 py-0.5 rounded-lg text-black whitespace-nowrap">
                                        {badgeLabel}
                                    </Badge>
                                )
                            )}
                        </div>
                    </div>

                    {/* MIDDLE: Name & Description */}
                    <div className="flex-1 flex flex-col items-start justify-center py-4 z-10 pr-10 min-w-0">
                        <h4 className="text-[16px] font-bold text-white group-hover:text-primary transition-colors leading-tight text-left max-w-[95%] truncate w-full">
                            {title}
                        </h4>
                        {description && (
                            <p className="text-[13px] text-zinc-400 line-clamp-4 mt-2 text-left max-w-[95%] font-medium leading-relaxed">
                                {truncatedDescription}
                            </p>
                        )}
                    </div>

                    {/* BOTTOM: Tags */}
                    <div className="flex justify-start w-full z-10 pt-2">
                        <div className="flex flex-wrap gap-2 justify-start">
                            {tags?.slice(0, 4).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                    </div>

                    {/* Bottom Accent Bar */}
                    <div className={cn(
                        "absolute bottom-0 left-0 right-0 h-1 z-30", 
                        isDraft ? "bg-transparent" : visualStyles.hoverBackgroundClassName
                    )} />
                </Card>
            </Link>
        );
    }

    // --- DEFAULT VARIANT (High quality horizontal row) ---
    return (
        <Link 
            href={href} 
            className={cn("group block w-full outline-none min-h-[160px]", className)}
            onClick={(mouseEvent) => {
                if (onClick) {
                    mouseEvent.preventDefault();
                    mouseEvent.stopPropagation();
                    onClick(mouseEvent);
                }
            }}
        >
            <Card className="flex flex-row items-start p-5 gap-5 border-zinc-200 dark:border-zinc-800 bg-card hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative h-full">
                
                {renderActions()}

                {/* Status/Type Badge - Positioned Absolutely in corner */}
                <div className="absolute top-3 right-3 z-30">
                    {isDraft ? (
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-500/10 border-zinc-500/20 px-2.5 py-0.5 rounded-lg text-zinc-500 shadow-none shrink-0">
                            Draft
                        </Badge>
                    ) : null}
                </div>

                {/* ICON COLUMN (Left) */}
                <div className="flex-shrink-0 pt-1">
                    {Icon && (
                        <div className={cn(
                            "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105", 
                        )}>
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                    )}
                </div>

                {/* CONTENT COLUMN (Right) */}
                <div className="flex min-w-0 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-1.5 pr-8">
                        <h4 className="text-[16px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate pr-2">
                            {title}
                        </h4>
                    </div>
                    {/* Description - Fixed height/lines */}
                    <div className="min-h-[50px] mb-2">
                        {description && (
                            <p className="text-[13px] text-muted-foreground line-clamp-3 leading-relaxed font-medium">
                                {truncatedDescription}
                            </p>
                        )}
                    </div>
                    
                    <div className="mt-auto">
                        {/* Tags - Reserved vertical space even if empty */}
                        <div className="flex flex-wrap gap-1.5 min-h-[24px] pt-2">
                            {tags?.slice(0, 4).map(tag => (
                                <TagChip key={tag} label={tag} />
                            ))}
                        </div>
                        
                        {footerContent && (
                            <div className="mt-3 opacity-60">
                                {footerContent}
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Accent Bar */}
                <div className={cn(
                    "absolute bottom-0 left-0 right-0 h-1 z-30", 
                    isDraft ? "bg-transparent" : visualStyles.hoverBackgroundClassName
                )} />
            </Card>
        </Link>
    );
};
