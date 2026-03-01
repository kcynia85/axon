import { StatusVariant } from "@/shared/ui/complex/StatusBadge";
import { ViewMode } from "@/shared/ui/complex/ResourceList";
import { Project } from "@/modules/projects/domain";
import { UseFormReturn, FieldArrayWithId } from "react-hook-form";
import { CreateProjectFormData } from "../application/schemas";
import { FilterGroup, FilterOption } from "@/shared/domain/filters";
import { SortOption } from "@/shared/domain/filters";

// --- View Models ---

export type ProjectViewModel = {
    readonly id: string;
    readonly title: string;
    readonly statusLabel: string;
    readonly statusVariant: StatusVariant;
    readonly displayTags: readonly string[];
    readonly hasMoreTags: boolean;
    readonly remainingTagsCount: number;
    readonly artifactsCount: number;
    readonly workspaces: readonly string[];
    readonly createdAt: string;
    readonly spaceUrl: string;
};

export type ArtifactViewModel = {
    readonly id: string;
    readonly name: string;
    readonly sourcePath: string;
    readonly statusLabel: string;
    readonly statusVariant: "success" | "info" | "default";
};

// --- Component Props ---

export interface ProjectCardProps {
    readonly viewModel: ProjectViewModel;
    readonly onViewDetails: (id: string) => void;
}

export interface ProjectListItemProps {
    readonly viewModel: ProjectViewModel;
    readonly onViewDetails: (id: string) => void;
}

export interface ProjectListProps {
    readonly projects: readonly ProjectViewModel[];
    readonly viewMode?: ViewMode;
    readonly isLoading?: boolean;
    readonly isError?: boolean;
    readonly onViewDetails: (id: string) => void;
}

export interface RecentlyUsedProjectsProps {
  readonly projects: readonly ProjectViewModel[];
  readonly onSelect: (id: string) => void;
  readonly className?: string;
}

export interface ProjectsBrowserProps {
  readonly initialProjects?: readonly Project[];
}

export type CreateProjectDialogProps = object;

// --- Form Component Props ---

export interface ProjectNameFieldProps {
    readonly form: UseFormReturn<CreateProjectFormData>;
}

export interface ProjectResourcesFieldProps {
    readonly form: UseFormReturn<CreateProjectFormData>;
    readonly linkFields: FieldArrayWithId<CreateProjectFormData, "links", "id">[];
    readonly onAppend: (value: { url: string }) => void;
    readonly onRemove: (index: number) => void;
}

export interface ProjectKeywordsFieldProps {
    readonly form: UseFormReturn<CreateProjectFormData>;
    readonly currentKeywords: readonly string[];
    readonly keywordInput: string;
    readonly onKeywordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    readonly onKeywordKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    readonly onRemoveKeyword: (keyword: string) => void;
}

export interface ProjectSpaceSelectorProps {
    readonly form: UseFormReturn<CreateProjectFormData>;
    readonly spaceMode: "new" | "existing";
    readonly projectName: string;
}

// --- Project Card Atom Props ---

export interface ProjectCardHeaderProps {
    readonly title: string;
    readonly statusLabel: string;
    readonly statusVariant: StatusVariant;
}

export interface ProjectCardContentProps {
    readonly tags: readonly string[];
    readonly artifactsCount: number;
}

export type ProjectCardFooterProps = object;

// --- Project List Item Atom Props ---

export interface ProjectListItemInfoProps {
    readonly title: string;
    readonly statusLabel: string;
    readonly tags: readonly string[];
    readonly hasMoreTags: boolean;
    readonly remainingTagsCount: number;
}

export interface ProjectListItemStatsProps {
    readonly artifactsCount: number;
}

export interface ProjectListItemActionsProps {
    readonly spaceUrl: string;
    readonly onViewDetails: () => void;
}

export interface ProjectListItemContainerProps {
    readonly children: React.ReactNode;
}

export interface ProjectListItemActionsGroupProps {
    readonly children: React.ReactNode;
}

// --- Projects Browser Section Props ---

export interface ProjectsFilterSectionProps {
    readonly filterGroups: readonly FilterGroup[];
    readonly activeFilters: readonly FilterOption[];
    readonly onToggleFilter: (groupId: string, optionId: string) => void;
    readonly onApplyFilters: () => void;
    readonly onClearAll: () => void;
    readonly onPendingFilterIdsChange: (ids: string[]) => void;
    readonly resultsCount: number;
}

export interface ProjectsActionsSectionProps {
    readonly sortBy: string;
    readonly onSortByChange: (id: string) => void;
    readonly viewMode: ViewMode;
    readonly onViewModeChange: (mode: ViewMode) => void;
    readonly sortOptions: readonly SortOption[];
}

export interface ProjectsBrowserContentProps {
    readonly recentlyUsedProjects: readonly ProjectViewModel[];
    readonly projects: readonly ProjectViewModel[];
    readonly viewMode: ViewMode;
    readonly onViewDetails: (id: string) => void;
    readonly isLoading: boolean;
    readonly isError: boolean;
}

// --- Recently Used Atom Props ---

export interface RecentlyUsedHeaderProps {
    readonly title: string;
}

export interface RecentlyUsedItemProps {
    readonly viewModel: ProjectViewModel;
    readonly onClick: (id: string) => void;
}

export interface RecentlyUsedGridProps {
    readonly children: React.ReactNode;
}
