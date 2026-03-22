"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { Terminal } from "lucide-react";
import { cn } from "@/shared/lib/utils";

type InternalToolsListProps = {
    readonly tools: InternalTool[];
    readonly isLoading: boolean;
    readonly onSelect: (tool: InternalTool) => void;
    readonly viewMode: "grid" | "list";
};

const InternalToolsList = ({ tools, isLoading, onSelect, viewMode }: InternalToolsListProps) => {
    // Only show production tools in the browser
    const productionTools = tools.filter(t => t.tool_status === "production");

    if (isLoading) {
        return (
            <div className={cn(
                "grid gap-8",
                viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            )}>
                {[1, 2, 3].map((index) => (
                    <Skeleton key={index} className={cn("w-full rounded-xl", viewMode === "grid" ? "h-[160px]" : "h-[100px]")} />
                ))}
            </div>
        );
    }

    if (productionTools.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground border-2 border-dashed rounded-xl border-zinc-200 dark:border-zinc-800">
                <p className="font-bold text-zinc-400 uppercase tracking-widest text-[10px]">No production tools available</p>
                <p className="text-[10px] opacity-60 mt-2 italic">Set your tools to 'Production' in local Axon Tools to see them here.</p>
            </div>
        );
    }

    return (
        <div className={cn(
            "grid gap-4 pb-10",
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "grid-cols-1"
        )}>
            {productionTools.map((tool: InternalTool) => {
                const cleanDescription = (tool.tool_description || "").split("Args:")[0].trim();
                const truncatedDescription = cleanDescription.length > 50 
                    ? `${cleanDescription.substring(0, 50)}...` 
                    : cleanDescription;
                
                const allTags = [...(tool.tool_keywords || [])].filter(tag => tag !== "python" && tag !== "synced");
                const limitedTags = allTags.slice(0, 2);
                
                return (
                    <WorkspaceCardHorizontal
                        key={tool.id}
                        title={tool.tool_display_name || tool.tool_function_name}
                        description={truncatedDescription}
                        href="#"
                        icon={Terminal}
                        badgeLabel={tool.tool_is_active ? "Active" : "Inactive"}
                        tags={limitedTags}
                        colorName="default"
                        useDirectHoverMenu
                        resourceId={tool.id}
                        onClick={(e) => {
                            e.preventDefault();
                            onSelect(tool);
                        }}
                        onEdit={() => onSelect(tool)}
                        onDelete={() => console.log("Delete tool", tool.id)}
                    />
                );
            })}
        </div>
    );
};

export default InternalToolsList;
