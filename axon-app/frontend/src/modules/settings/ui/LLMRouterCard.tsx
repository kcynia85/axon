import React from "react";
import { Card } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Network, Cpu, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";
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
    // Humanize strategy label
    const strategyLabel = strategy.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

    return (
        <Card 
            className="group relative flex flex-col p-6 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all rounded-2xl overflow-hidden min-h-[220px] cursor-pointer"
            onClick={onClick}
        >
            {/* Actions Menu */}
            <div className="absolute top-4 right-4 z-20">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <MoreVertical className="w-4 h-4" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={onEdit} className="gap-2">
                            <Edit2 className="w-3.5 h-3.5" /> Edytuj
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onDelete} className="gap-2 text-red-500 focus:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" /> Usuń
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Header Area */}
            <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-white">
                    {title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                        {strategyLabel}
                    </span>
                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <Network className="w-3 h-3 text-primary opacity-50" />
                </div>
            </div>

            {/* Models List - Priority Chain Preview */}
            <div className="space-y-2.5 flex-1">
                {models.length > 0 ? (
                    models.map((model, index) => (
                        <div key={`${id}-${model.id}-${index}`} className="flex items-center gap-3 group/item">
                            <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-zinc-600 w-4">
                                {index + 1}.
                            </span>
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50 w-full transition-colors group-hover/item:border-primary/20">
                                <Cpu className="w-3 h-3 text-zinc-400" />
                                <span className="text-[12px] font-medium text-zinc-700 dark:text-zinc-300 truncate">
                                    {model.name}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-[11px] italic text-zinc-500 py-2">
                        Brak skonfigurowanego łańcucha modeli.
                    </p>
                )}
            </div>

            {/* Bottom Status / Link */}
            <Link 
                href={`/settings/llms/routers/${id}`}
                className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex items-center justify-between group/link"
            >
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover/link:text-primary transition-colors">
                    Szczegóły Konfiguracji
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 group-hover/link:bg-primary transition-colors" />
            </Link>
        </Card>
    );
};
