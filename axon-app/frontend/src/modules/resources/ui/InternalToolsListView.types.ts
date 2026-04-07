import { InternalTool } from "@/shared/domain/resources";
import { ViewMode } from "@/shared/ui/complex/ResourceList";

export type InternalToolsListViewProps = {
    readonly tools: readonly InternalTool[];
    readonly isLoading: boolean;
    readonly viewMode: ViewMode;
    readonly onSelect: (tool: InternalTool) => void;
    readonly onDelete: (tool: InternalTool) => void;
};
