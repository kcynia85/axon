'use client';

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useServicesBrowser } from "../application/useServicesBrowser";
import { ServicesBrowserContent } from "./components/ServicesBrowserContent";
import { RecentlyUsedServices } from "./components/RecentlyUsedServices";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { ExternalService } from "@/shared/domain/resources";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Workspace", groupId: "workspaces" },
  { label: "By Category", groupId: "category" },
];

interface ServicesBrowserProps {
  initialServices?: ExternalService[];
}

export const ServicesBrowser = ({ initialServices = [] }: ServicesBrowserProps) => {
  const {
    services,
    processedServices,
    recentlyUsedServices,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedService,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig
  } = useServicesBrowser(initialServices);

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
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search services..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        topContent={
          <RecentlyUsedServices 
            services={recentlyUsedServices} 
            onSelect={handleViewDetails} 
          />
        }
        actionBar={
          <ActionBar 
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            quickFilters={QUICK_FILTERS}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(services)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        <ServicesBrowserContent 
            services={processedServices}
            viewMode={viewMode}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            isError={isError}
        />
      </BrowserLayout>

      {/* Service Details Sidebar */}
      <SidePeek 
        title={selectedService?.service_name || "Service Details"}
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
      >
        {selectedService && (
            <div className="p-6">
                <h3 className="text-lg font-bold">{selectedService.service_name}</h3>
                <p className="text-sm text-muted-foreground mt-2">{selectedService.service_description}</p>
                <div className="mt-6 space-y-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">URL</span>
                        <p className="text-sm font-mono mt-1">{selectedService.service_url}</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Category</span>
                        <p className="text-sm mt-1">{selectedService.service_category}</p>
                    </div>
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Capabilities</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedService.capabilities?.map((cap, i) => (
                                <span key={i} className="px-2 py-1 rounded bg-muted text-xs font-medium border">{cap}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </SidePeek>
    </>
  );
};
