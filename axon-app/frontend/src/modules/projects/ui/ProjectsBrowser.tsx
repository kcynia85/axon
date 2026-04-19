'use client';

import React from "react";
import { SortOption } from "@/shared/domain/filters";
import { useProjectsBrowser } from "@/modules/projects/application/useProjectsBrowser";
import { ProjectsBrowserProps } from "./types";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { ProjectsBrowserView } from "./pure/ProjectsBrowserView";

import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Workspace", groupId: "workspace" },
  { label: "By Status", groupId: "status" },
];

export const ProjectsBrowser = ({ initialProjects = [] }: ProjectsBrowserProps) => {
  const {
    projects,
    processedProjectViewModels,
    recentlyUsedViewModels,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedProject,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    handleConfigure,
    handleDelete,
    filterConfig
  } = useProjectsBrowser(initialProjects);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getPreviewCount,
    setPendingFilterIds,
  } = filterConfig;

  return (
    <ProjectsBrowserView 
        projects={projects}
        processedProjectViewModels={processedProjectViewModels}
        recentlyUsedViewModels={recentlyUsedViewModels}
        viewMode={viewMode}
        isLoading={isLoading}
        isError={isError}
        selectedProject={selectedProject}
        isSidebarOpen={isSidebarOpen}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOptions={SORT_OPTIONS}
        activeFilters={activeFilters}
        filterGroups={filterGroups}
        quickFilters={QUICK_FILTERS}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onViewModeChange={setViewMode}
        onToggleFilter={handleToggleFilter}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAll}
        onApplyFilters={handleApplyFilters}
        onPendingFilterIdsChange={setPendingFilterIds}
        onViewDetails={handleViewDetails}
        onConfigure={handleConfigure}
        onDelete={handleDelete}
        onSidebarOpenChange={setIsSidebarOpen}
        previewCount={getPreviewCount(projects)}
    />
  );
};

