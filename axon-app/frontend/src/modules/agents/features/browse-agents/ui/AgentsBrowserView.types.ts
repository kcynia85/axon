import { Agent } from "@/shared/domain/workspaces";
import { SortOption, FilterGroup, ActiveFilter } from "@/shared/domain/filters";

export type ViewMode = "grid" | "list";

export interface AffectedResource {
  id: string;
  name: string;
  role: string;
}

export type AgentsBrowserViewProps = {
  readonly processedAgents: readonly Agent[];
  readonly draftAgent: Agent | null;
  readonly viewMode: ViewMode;
  readonly setViewMode: (mode: ViewMode) => void;
  readonly colorName: string;
  readonly searchQuery: string;
  readonly onSearchChange: (query: string) => void;
  readonly sortBy: string;
  readonly onSortChange: (sort: string) => void;
  readonly sortOptions: readonly SortOption[];
  readonly activeFilters: readonly ActiveFilter[];
  readonly filterGroups: readonly FilterGroup[];
  readonly onToggleFilter: (id: string) => void;
  readonly onRemoveFilter: (id: string) => void;
  readonly onClearAllFilters: () => void;
  readonly onApplyFilters: (selectedIds: string[]) => void;
  readonly onPendingFilterIdsChange: (selectedIds: string[]) => void;
  readonly resultsCount: number;
  readonly isSidebarOpen: boolean;
  readonly onCloseSidebar: () => void;
  readonly activeAgent: Agent | null;
  readonly onEditAgent: (agent: Agent) => void;
  readonly onDeleteAgent: (id: string) => void;
  readonly onViewDetails: (id: string) => void;
  readonly agentToDelete: Agent | null;
  readonly affectedResources: readonly AffectedResource[];
  readonly isInspectionLoading: boolean;
  readonly onConfirmDelete: () => void;
  readonly onCancelDelete: () => void;
};
