"use client";

import * as React from "react";
import { InternalTool } from "@/shared/domain/resources";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { InternalToolsListView } from "./InternalToolsListView";
import { ViewMode } from "@/shared/ui/complex/ResourceList";

interface Props {
    readonly tools?: InternalTool[];
    readonly isLoading?: boolean;
    readonly viewMode?: ViewMode;
    readonly onSelect: (tool: InternalTool) => void;
}

/**
 * InternalToolsList: Container for the internal tools listing.
 * Standard: Container pattern, orchestrates state.
 */
export const InternalToolsList = ({ 
    tools = [], 
    isLoading = false, 
    viewMode = "grid",
    onSelect 
}: Props) => {
    const { deleteWithUndo } = useDeleteWithUndo();
    const { pendingIds } = usePendingDeletionsStore();

    const handleDelete = (tool: InternalTool) => {
        const toolName = tool.tool_display_name || tool.tool_function_name;
        if (confirm(`Czy na pewno chcesz usunąć narzędzie "${toolName}"?`)) {
            deleteWithUndo(tool.id, toolName, () => {
                console.log("Permanently deleting tool", tool.id);
            });
        }
    };

    // Filter tools directly - React Compiler will handle optimizations
    const filteredTools = tools.filter(tool => !pendingIds.has(tool.id));

    return (
        <InternalToolsListView
            tools={filteredTools}
            isLoading={isLoading}
            viewMode={viewMode}
            onSelect={onSelect}
            onDelete={handleDelete}
        />
    );
};

export default InternalToolsList;
