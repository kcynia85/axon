/**
 * Shared Filter Domain Types
 * Used across multiple modules (Projects, Agents, Crews, etc.)
 */

export type FilterOptionId = string;
export type FilterGroupId = string;

export interface FilterOption {
  readonly id: FilterOptionId;
  readonly label: string;
  readonly isChecked: boolean;
  readonly category?: string;
}

export interface FilterGroup {
  readonly id: FilterGroupId;
  readonly title: string;
  readonly options: readonly FilterOption[];
}

export interface ActiveFilter {
  readonly id: FilterOptionId;
  readonly label: string;
  readonly category?: string;
}

/**
 * Shared Sorting Types
 */
export type SortDirection = 'asc' | 'desc';

export interface SortOption {
  readonly id: string;
  readonly label: string;
}
