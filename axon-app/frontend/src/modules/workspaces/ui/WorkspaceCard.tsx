import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import Link from "next/link";
import { Workspace } from "@/shared/domain/workspaces";
import { cn } from "@/shared/lib/utils";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import { formatDistanceToNow } from "date-fns";

type WorkspaceCardProps = {
    readonly workspace: Workspace;
}

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

export const WorkspaceCard = ({ workspace }: WorkspaceCardProps) => {
    const { id, name, description, updated_at } = workspace;

    // Extract color identifier from ID (e.g., ws-product -> product)
    const colorKey = id.replace("ws-", "");
    const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";
    const styles = getVisualStylesForZoneColor(colorName);
    const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

    const hoverBorderClass = {
        blue: "group-hover:border-blue-500/50",
        purple: "group-hover:border-purple-500/50",
        pink: "group-hover:border-pink-500/50",
        green: "group-hover:border-green-500/50",
        yellow: "group-hover:border-yellow-500/50",
        orange: "group-hover:border-orange-500/50",
        default: "group-hover:border-zinc-400"
    }[colorName] || "group-hover:border-zinc-400";

    return (
        <Link href={`/workspaces/${id}`} className="block h-full group outline-none">
            <Card 
                className={cn(
                    "relative h-full overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-300",
                    "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                    "group-hover:shadow-2xl group-hover:shadow-black/5 dark:group-hover:shadow-white/5",
                    "group-hover:-translate-y-1 group-active:scale-[0.98]",
                    hoverBorderClass
                )}
            >
                {/* Background Grid Pattern (Static, kept for subtle texture) */}
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
                    style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
                />

                <CardHeader className="relative z-10 space-y-4 pb-2 pt-5">
                    <div className="space-y-1.5">
                        <CardTitle className={cn(
                            "text-xl font-bold tracking-tight transition-colors duration-200",
                            "text-zinc-800 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white"
                        )}>
                            {name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-zinc-500 text-xs leading-relaxed min-h-[2.5rem] group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-200">
                            {description}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 mt-auto pt-2 pb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 transition-colors duration-200 group-hover:bg-zinc-600 dark:group-hover:bg-zinc-400" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 transition-colors duration-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-400" suppressHydrationWarning>
                            <span className="text-zinc-400 dark:text-zinc-600 font-medium">Last update:</span> {updated_at ? formatDistanceToNow(new Date(updated_at), { addSuffix: true }) : "—"}
                        </p>
                    </div>
                </CardContent>

                {/* Accent Bottom Bar */}
                <div 
                    className={cn("absolute bottom-0 left-0 right-0 h-1 opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
                />
            </Card>
        </Link>
    );
};
