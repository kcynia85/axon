import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import Link from "next/link";
import { Workspace } from "@/shared/domain/workspaces";
import { cn } from "@/shared/lib/utils";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";

interface WorkspaceCardProps {
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

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({ workspace }) => {
    const { id, name, description, updated_at } = workspace;

    // Extract color identifier from ID (e.g., ws-product -> product)
    const colorKey = id.replace("ws-", "");
    const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";
    const styles = getVisualStylesForZoneColor(colorName);
    const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

    return (
        <Link href={`/workspaces/${id}`} className="block h-full group">
            <Card 
                className={cn(
                    "relative h-full overflow-hidden transition-all duration-500 cursor-pointer shadow-sm flex flex-col pt-2",
                    "border-zinc-200/60 bg-white/70 backdrop-blur-md",
                    "dark:border-zinc-800/50 dark:bg-zinc-950/40",
                    "group-hover:scale-[1.01] group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)]",
                    "dark:group-hover:bg-zinc-900/50 dark:group-hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                )}
                style={{ 
                    // @ts-ignore
                    "--tw-shadow-color": `rgba(${rgb}, 0.05)`,
                    borderColor: `rgba(${rgb}, 0.15)`
                }}
            >
                {/* Background Grid Pattern (Subtle) */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                    style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
                />

                {/* Accent Top Bar */}
                <div 
                    className={cn("absolute top-0 left-0 right-0 h-[2px] transition-all duration-500 group-hover:h-[3px] opacity-40 group-hover:opacity-100", styles.hoverBackgroundClassName)} 
                />

                {/* Glow Effect on Hover */}
                <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                    style={{
                        background: `radial-gradient(600px circle at 50% 50%, rgba(${rgb}, 0.1), transparent 40%)`
                    }}
                />

                <CardHeader className="relative z-10 space-y-4 pb-2 pt-5">
                    <div className="space-y-1.5">
                        <CardTitle className={cn(
                            "text-xl font-bold tracking-tight transition-all duration-300",
                            "text-zinc-800 group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white"
                        )}>
                            {name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 text-zinc-500 text-xs leading-relaxed min-h-[2.5rem] group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                            {description}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="relative z-10 mt-auto pt-2 pb-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-600 transition-all duration-500 group-hover:scale-125 group-hover:bg-zinc-600 dark:group-hover:bg-zinc-400" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400 dark:text-zinc-500 transition-colors group-hover:text-zinc-600 dark:group-hover:text-zinc-400" suppressHydrationWarning>
                            <span className="text-zinc-400 dark:text-zinc-600 font-medium">Last update:</span> {updated_at ? new Date(updated_at).toLocaleDateString() : "—"}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
