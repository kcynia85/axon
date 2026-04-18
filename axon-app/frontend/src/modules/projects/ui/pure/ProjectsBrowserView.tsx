import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { ProjectDetails } from "../ProjectDetails";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ProjectsBrowserContent } from "../components/ProjectsBrowserContent";
import { RecentlyUsedProjects } from "../RecentlyUsedProjects";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { ProjectViewModel, ArtifactViewModel } from "../types";
import { ActiveFilter, FilterGroup, SortOption } from "@/shared/domain/filters";
import { Project, Artifact } from "../../domain";

export type ProjectsBrowserViewProps = {
    readonly projects: readonly Project[];
    readonly processedProjectViewModels: readonly ProjectViewModel[];
    readonly recentlyUsedViewModels: readonly ProjectViewModel[];
    readonly viewMode: 'grid' | 'list';
    readonly isLoading: boolean;
    readonly isError: boolean;
    readonly selectedProject: Project | null;
    readonly artifacts: readonly Artifact[];
    readonly isLoadingArtifacts: boolean;
    readonly isSidebarOpen: boolean;
    readonly activeTab: string;
    readonly searchQuery: string;
    readonly sortBy: string;
    readonly sortOptions: readonly SortOption[];
    readonly activeFilters: readonly ActiveFilter[];
    readonly filterGroups: readonly FilterGroup[];
    readonly quickFilters: readonly QuickFilter[];
    readonly onSearchChange: (query: string) => void;
    readonly onSortChange: (sortBy: string) => void;
    readonly onViewModeChange: (mode: 'grid' | 'list') => void;
    readonly onToggleFilter: (id: string) => void;
    readonly onRemoveFilter: (id: string) => void;
    readonly onClearAllFilters: () => void;
    readonly onApplyFilters: (selectedIds: string[]) => void;
    readonly onPendingFilterIdsChange: (selectedIds: string[]) => void;
    readonly onViewDetails: (id: string) => void;
    readonly onSidebarOpenChange: (open: boolean) => void;
    readonly onTabChange: (tab: string) => void;
    readonly previewCount: number;
}

export const ProjectsBrowserView = ({
    projects,
    processedProjectViewModels,
    recentlyUsedViewModels,
    viewMode,
    isLoading,
    isError,
    selectedProject,
    artifacts,
    isLoadingArtifacts,
    isSidebarOpen,
    activeTab,
    searchQuery,
    sortBy,
    sortOptions,
    activeFilters,
    filterGroups,
    quickFilters,
    onSearchChange,
    onSortChange,
    onViewModeChange,
    onToggleFilter,
    onRemoveFilter,
    onClearAllFilters,
    onApplyFilters,
    onPendingFilterIdsChange,
    onViewDetails,
    onSidebarOpenChange,
    onTabChange,
    previewCount
}: ProjectsBrowserViewProps): React.ReactNode => {
    return (
        <>
            <BrowserLayout
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                searchPlaceholder="Search projects..."
                activeFilters={activeFilters.length > 0 && (
                    <FilterBar 
                        activeFilters={activeFilters}
                        onRemove={onRemoveFilter}
                        onClearAll={onClearAllFilters}
                    />
                )}
                topContent={
                    <RecentlyUsedProjects 
                        projects={recentlyUsedViewModels} 
                        onSelect={onViewDetails} 
                    />
                }
                actionBar={
                    <ActionBar 
                        filterGroups={filterGroups}
                        activeFilters={activeFilters}
                        quickFilters={quickFilters}
                        onToggleFilter={onToggleFilter}
                        onApplyFilters={onApplyFilters}
                        onClearAllFilters={onClearAllFilters}
                        onPendingFilterIdsChange={onPendingFilterIdsChange}
                        resultsCount={previewCount}
                        sortOptions={sortOptions}
                        sortBy={sortBy}
                        onSortChange={onSortChange}
                        viewMode={viewMode}
                        onViewModeChange={onViewModeChange}
                    />
                }
            >
                <ProjectsBrowserContent 
                    projects={processedProjectViewModels}
                    viewMode={viewMode}
                    onViewDetails={onViewDetails}
                    isLoading={isLoading}
                    isError={isError}
                />
            </BrowserLayout>

            <SidePeek 
                title={selectedProject?.project_name || "Project Details"}
                open={isSidebarOpen} 
                onOpenChange={onSidebarOpenChange}
            >
                {selectedProject && (
                    <ProjectDetails 
                        project={selectedProject} 
                        artifacts={artifacts} 
                        activeTab={activeTab}
                        onTabChange={onTabChange}
                        isLoadingArtifacts={isLoadingArtifacts}
                    />
                )}
            </SidePeek>
        </>
    );
};
