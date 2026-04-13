import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { FileText, FileCode, File, LucideIcon } from "lucide-react";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { Badge } from "@/shared/ui/ui/Badge";
import { cn } from "@/shared/lib/utils";
import { KnowledgeBrowserViewProps, KnowledgeResource } from "./KnowledgeBrowserView.types";

const getResourceIcon = (type: string): LucideIcon => {
    switch (type) {
        case "markdown": return FileText;
        case "code": return FileCode;
        case "pdf": return File;
        default: return File;
    }
};

export const KnowledgeBrowserView = ({
    searchQuery,
    onSearchChange,
    viewMode,
    setViewMode,
    sortBy,
    onSortChange,
    activeFilters,
    filterGroups,
    quickFilters,
    sortOptions,
    onToggleFilter,
    onRemoveFilter,
    onClearAllFilters,
    onClearAllFilters: onClearAll,
    onApplyFilters,
    onSelectionChange,
    filteredResources,
    previewCount,
    onDelete,
    onEdit,
    onResourceClick,
    isLoading = false,
}: KnowledgeBrowserViewProps & { onResourceClick: (resource: KnowledgeResource) => void; isLoading?: boolean }) => {
    return (
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            searchPlaceholder="Search knowledge base..."
            activeFilters={activeFilters.length > 0 && (
                <FilterBar 
                    activeFilters={activeFilters as any}
                    onRemove={onRemoveFilter as any}
                    onClearAll={onClearAllFilters}
                />
            )}
            actionBar={
                <ActionBar 
                    filterGroups={filterGroups as any}
                    activeFilters={activeFilters as any}
                    quickFilters={quickFilters as any}
                    onToggleFilter={onToggleFilter}
                    onApplyFilters={onApplyFilters} 
                    onSelectionChange={onSelectionChange}
                    onClearAllFilters={onClearAllFilters}
                    onPendingFilterIdsChange={onSelectionChange}
                    resultsCount={previewCount}
                    sortOptions={sortOptions as any}
                    sortBy={sortBy}
                    onSortChange={onSortChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />
            }
        >
            <ResourceList
                items={filteredResources as any}
                isLoading={isLoading}
                viewMode={viewMode}
                renderItem={(resource: KnowledgeResource) => (
                    <ResourceCard
                        key={resource.id}
                        title={resource.title}
                        description={resource.hubName || "Brak przypisanego huba"}
                        badgeLabel={resource.status === "Pending" ? "Pending" : resource.vectorDatabaseName}
                        href="#"
                        status={
                            resource.status === "Error" ? "error" : "none"
                        }
                        icon={getResourceIcon(resource.type)}
                        onClick={() => onResourceClick(resource)}
                    />
                )}
            />
        </BrowserLayout>
    );
};
