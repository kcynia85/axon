"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";

interface Props {
    readonly tools?: InternalTool[];
    readonly isLoading?: boolean;
    readonly onSelect: (tool: InternalTool) => void;
}

/**
 * InternalToolsList - Displays a list of internal tools in a horizontal workspace card format.
 * Includes Delete with Undo pattern.
 */
export const InternalToolsList = ({ tools = [], isLoading, onSelect }: Props) => {
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();

    if (isLoading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                ))}
            </div>
        );
    }

    const filteredTools = tools.filter(tool => !pendingIds.has(tool.id));

    return (
        <div className="space-y-4">
            {filteredTools.map((tool) => {
                const categories = [tool.tool_type || "utility"];
                
                return (
                    <WorkspaceCardHorizontal
                        key={tool.id}
                        title={tool.tool_display_name || tool.tool_function_name}
                        description={tool.tool_description}
                        categories={categories}
                        onClick={(e) => {
                            e.preventDefault();
                            onSelect(tool);
                        }}
                        onEdit={() => onSelect(tool)}
                        onDelete={() => {
                            if (confirm(`Czy na pewno chcesz usunąć narzędzie "${tool.tool_display_name || tool.tool_function_name}"?`)) {
                                deleteWithUndo(tool.id, tool.tool_display_name || tool.tool_function_name, () => {
                                    console.log("Permanently deleting tool", tool.id);
                                });
                            }
                        }}
                    />
                );
            })}
        </div>
    );
};

export default InternalToolsList;
