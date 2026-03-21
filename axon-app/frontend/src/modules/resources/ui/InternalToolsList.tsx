"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

type InternalToolsListProps = {
    readonly tools: InternalTool[];
    readonly isLoading: boolean;
    readonly onSelect: (tool: InternalTool) => void;
};

const InternalToolsList = ({ tools, isLoading, onSelect }: InternalToolsListProps) => {
    // Only show production tools in the browser
    const productionTools = tools.filter(t => t.tool_status === "production");

    if (isLoading) {
        return (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-[160px] w-full rounded-xl" />)}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
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
