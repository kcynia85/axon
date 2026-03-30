import React from "react";
import { Card } from "@/shared/ui/ui/Card";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";

export type LLMRouterCardProps = {
    readonly id: string;
    readonly title: string;
    readonly strategy: string;
    readonly models: { id: string; name: string }[];
    readonly onEdit?: () => void;
    readonly onDelete?: () => void;
    readonly onClick?: () => void;
};

/**
 * LLMRouterCard - Optimized for Router configuration preview.
 * Matches the requested design with numbered chain steps.
 */
export const LLMRouterCard = ({
    id,
    title,
    strategy,
    models,
    onEdit,
    onDelete,
    onClick,
}: LLMRouterCardProps) => {
    const strategyLabel = strategy.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return (
        <Card 
            className="group relative flex flex-col p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all rounded-2xl overflow-hidden min-h-[160px] cursor-pointer"
            onClick={onClick}
        >
            {/* Hover Actions Menu */}
            <div className="absolute top-3 right-3 z-40 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-primary hover:text-primary-foreground transition-all"
                        onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                )}
                {onDelete && (
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 bg-zinc-100 dark:bg-zinc-900 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                )}
            </div>

            {/* Header Area */}
            <div className="space-y-3">
                <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                    {title}
                </h3>
                <Badge variant="secondary" className="font-bold text-[10px] uppercase tracking-wider bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border-none w-fit">
                    {strategyLabel}
                </Badge>
            </div>
        </Card>
    );
};
