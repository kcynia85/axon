import type { Tool } from "../../domain/tool.types";
import type { SortDescriptor } from "@heroui/react";
import type { FilterGroup, SortOption, ActiveFilter } from "@/shared/domain/filters";

export type ToolsRegistryViewProps = {
  readonly items: readonly Tool[];
  readonly isLoading: boolean;
  readonly error: any;
  readonly searchFilter: string;
  readonly sortDescriptor: SortDescriptor;
  readonly page: number;
  readonly pages: number;
  readonly filterGroups: readonly FilterGroup[];
  readonly filteredCount: number;
  readonly activeFilters: readonly ActiveFilter[];
  readonly sortOptions: readonly SortOption[];
  readonly activeSortId: string;
  readonly onSearchChange: (value: string) => void;
  readonly onSortChange: (descriptor: SortDescriptor) => void;
  readonly onPageChange: (page: number) => void;
  readonly onToolSelect: (tool: Tool) => void;
  readonly onApplyFilters: (selectedIds: string[]) => void;
  readonly onClearFilters: () => void;
  readonly onRemoveFilter: (id: string) => void;
  readonly onSortOptionSelect: (id: string) => void;
};

export type ToolsRegistryHeaderProps = {
  readonly searchFilter: string;
  readonly filterGroups: readonly FilterGroup[];
  readonly filteredCount: number;
  readonly activeFilters: readonly ActiveFilter[];
  readonly sortOptions: readonly SortOption[];
  readonly activeSortId: string;
  readonly onSearchChange: (value: string) => void;
  readonly onApplyFilters: (selectedIds: string[]) => void;
  readonly onClearFilters: () => void;
  readonly onRemoveFilter: (id: string) => void;
  readonly onSortOptionSelect: (id: string) => void;
};
