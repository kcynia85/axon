import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import Link from "next/link";
import { Workspace } from "@/shared/domain/workspaces";
import { cn } from "@/shared/lib/utils";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

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

    return (
        <Link href={`/workspaces/${id}`} className="block h-full group transition-transform active:scale-[0.98]">
            <Card 
                className={cn(
                    "relative h-full overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200",
                    "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                    "group-hover:shadow-md",
                    // Hover border color based on workspace color
                    `group-hover:${styles.borderClassName}`
                )}
            >
                {/* Accent Top Bar (Remains as a subtle identifier) */}
                <div 
                    className={cn("absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
                />

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
                            <span className="text-zinc-400 dark:text-zinc-600 font-medium">Last update:</span> {updated_at ? new Date(updated_at).toLocaleDateString() : "—"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
