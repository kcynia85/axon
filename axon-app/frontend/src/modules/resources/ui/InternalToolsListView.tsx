import React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { InternalToolsListViewProps } from "./InternalToolsListView.types";
import { Terminal } from "lucide-react";

/**
 * InternalToolsListView: Pure presentation layer for the internal tools list.
 * Standard: Pure View pattern, 0% logic, 0% useEffect.
 */
export const InternalToolsListView = ({ 
    tools, 
    isLoading, 
    viewMode,
    onSelect, 
    onDelete 
}: InternalToolsListViewProps) => {
    const isGrid = viewMode === "grid";

    if (isLoading) {
        return (
            <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {[1, 2, 3].map((index) => (
                    <Skeleton key={index} className={isGrid ? "h-48 w-full rounded-2xl" : "h-24 w-full rounded-2xl"} />
                ))}
            </div>
        );
    }

    if (tools.length === 0) {
        return (
            <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl font-mono text-sm uppercase tracking-widest">
                No tools found.
            </div>
        );
    }

    return (
        <div className={isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
            {tools.map((tool) => {
                const tags = [tool.tool_category || "utility"];
                
                if (isGrid) {
                    return (
                        <ResourceCard
                            key={tool.id}
                            title={tool.tool_display_name || tool.tool_function_name}
                            description={tool.tool_description}
                            tags={tags}
                            href="#"
                            icon={Terminal}
                            onClick={() => onSelect(tool)}
                            onEdit={(mouseEvent) => {
                                mouseEvent.preventDefault();
                                onSelect(tool);
                            }}
                            onDelete={(mouseEvent) => {
                                mouseEvent.preventDefault();
                                onDelete(tool);
                            }}
                        />
                    );
                }

                return (
                    <WorkspaceCardHorizontal
                        key={tool.id}
                        title={tool.tool_display_name || tool.tool_function_name}
                        description={tool.tool_description}
                        tags={tags}
                        href="#"
                        onClick={(mouseEvent) => {
                            mouseEvent.preventDefault();
                            onSelect(tool);
                        }}
                        onEdit={() => onSelect(tool)}
                        onDelete={() => onDelete(tool)}
                    />
                );
            })}
        </div>
    );
};
