import React from "react";
import Link from "next/link";
import { LucideIcon, Edit2, Trash2, MoreVertical, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { CategoryChip } from "@/shared/ui/ui/CategoryChip";
import { Button } from "@/shared/ui/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

export type ResourceCardProps = {
    readonly title: string;
    readonly description?: string | null;
    readonly href: string;
    readonly badgeLabel?: string | null;
    readonly categories?: readonly string[];
    readonly icon?: LucideIcon;
    readonly footerContent?: React.ReactNode;
    readonly className?: string;
    readonly onEdit?: (e: React.MouseEvent) => void;
    readonly onDelete?: (e: React.MouseEvent) => void; 
    readonly onClick?: (e: React.MouseEvent) => void;
    readonly isDraft?: boolean;
    readonly useDirectHoverMenu?: boolean;
};

/**
 * ResourceCard - A standardized card component for displaying resources (Tools, Archetypes, Services).
 * Features a consistent layout with an icon on the left and content on the right.
 */
export const ResourceCard = ({
    title,
    description,
    href,
    badgeLabel,
    categories,
    icon: Icon,
    footerContent,
    className,
    onEdit,
    onDelete, 
    onClick,
    isDraft = false,
    useDirectHoverMenu = true
}: ResourceCardProps) => {

    // Helper for description truncation
    const truncatedDescription = description && description.length > 300 
        ? `${description.substring(0, 300)}...` 
        : description;

    const renderActions = () => {
        if (!onEdit && !onDelete) return null; 

        if (useDirectHoverMenu) {
            return (
                <div className="absolute top-3 right-3 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEdit && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 bg-black/60 text-white hover:bg-white/20"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(e); }}
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 bg-black/60 text-red-400 hover:bg-red-500/20 hover:text-red-500"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(e); }}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    )}
                </div>
            );
        }

        return (
            <div className="absolute top-3 right-3 z-40">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            className="p-1.5 rounded-md hover:bg-white/20 bg-black/60 text-zinc-300 hover:text-white transition-colors"
                        >
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {onEdit && (
                            <DropdownMenuItem 
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onEdit(e);
                                }}
                            >
                                <ChevronRight className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        )}
                        {onDelete && (
                            <DropdownMenuItem 
                                variant="destructive"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onDelete(e); 
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        );
    };

    return (
        <Link 
            href={href} 
            className={cn("group block w-full outline-none min-h-[160px]", className)}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault();
                    e.stopPropagation();
                    onClick(e);
                }
            }}
        >
            <Card className="flex flex-row items-start p-5 border-zinc-200 dark:border-zinc-800 bg-card hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md transition-all rounded-xl overflow-hidden active:scale-[0.99] relative h-full">
                
                {renderActions()}

                {/* Status/Type Badge - Positioned Absolutely in corner */}
                <div className="absolute top-3 right-3 z-30">
                    {isDraft ? (
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-[0.2em] bg-zinc-500/10 border-zinc-500/20 px-2.5 py-0.5 rounded-lg text-zinc-500 shadow-none shrink-0">
                            Draft
                        </Badge>
                    ) : (
                        badgeLabel && (
                            <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-lg text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                                {badgeLabel}
                            </Badge>
                        )
                    )}
                </div>

                {/* ICON COLUMN (Left) */}
                {Icon && (
                    <div className="flex-shrink-0 mr-[24px] pt-1">
                        <div className={cn(
                            "w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105", 
                        )}>
                            <Icon className="w-5 h-5 text-primary" />
                        </div>
                    </div>
                )}

                {/* CONTENT COLUMN (Right) */}
                <div className="flex-1 min-w-0 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-1.5 pr-8">
                        <h4 className="text-[16px] font-bold tracking-tight text-foreground group-hover:text-primary transition-colors truncate pr-2">
                            {title}
                        </h4>
                    </div>

                    {/* Categories - Moved up to be under title */}
                    <div className="flex flex-wrap gap-1.5 min-h-[24px] mb-2">
                        {categories?.slice(0, 4).map(category => (
                            <CategoryChip key={category} label={category} />
                        ))}
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
                        {footerContent && (
                            <div className="mt-3">
                                {footerContent}
                            </div>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
};
