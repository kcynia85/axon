'use client';

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useAutomationsBrowser } from "../application/useAutomationsBrowser";
import { AutomationsBrowserContent } from "./components/AutomationsBrowserContent";
import { RecentlyUsedAutomations } from "./components/RecentlyUsedAutomations";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { Automation } from "@/shared/domain/resources";
import { Badge } from "@/shared/ui/ui/Badge";
import { Zap, Globe, Clock, ShieldCheck, Activity } from "lucide-react";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Workspace", groupId: "workspaces" },
  { label: "By Platform", groupId: "platform" },
];

interface AutomationsBrowserProps {
  initialAutomations?: Automation[];
}

export const AutomationsBrowser = ({ initialAutomations = [] }: AutomationsBrowserProps) => {
  const {
    automations,
    processedAutomations,
    recentlyUsedAutomations,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedAutomation,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig
  } = useAutomationsBrowser(initialAutomations);

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
        searchPlaceholder="Search automations..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        topContent={
          <RecentlyUsedAutomations 
            automations={recentlyUsedAutomations} 
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
            resultsCount={getPreviewCount(automations)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        <AutomationsBrowserContent 
            automations={processedAutomations}
            viewMode={viewMode}
            onViewDetails={handleViewDetails}
            isLoading={isLoading}
            isError={isError}
        />
      </BrowserLayout>

      {/* Automation Details Sidebar */}
      <SidePeek 
        title={selectedAutomation?.automation_name || "Automation Details"}
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
      >
        {selectedAutomation && (
            <div className="p-8 space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <Badge variant="outline" className="px-3 py-1 font-mono text-[10px] tracking-widest uppercase bg-primary/5 text-primary border-primary/20">
                            {selectedAutomation.automation_platform}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Clock className="w-3 h-3" /> Updated 2h ago
                        </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{selectedAutomation.automation_name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {selectedAutomation.automation_description || "No description provided for this automation."}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl border border-primary/5 space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Activity className="w-3 h-3" /> Runtime Status
                        </h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Validation</span>
                            <Badge variant={selectedAutomation.automation_validation_status === "Valid" ? "default" : "secondary"}>
                                {selectedAutomation.automation_validation_status}
                            </Badge>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl border border-primary/5 space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Globe className="w-3 h-3" /> Endpoint
                        </h4>
                        <div className="space-y-1">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Webhook URL</span>
                            <p className="text-sm font-mono break-all bg-background/50 p-2 rounded border">{selectedAutomation.automation_webhook_url}</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-medium">Method</span>
                            <Badge variant="outline" className="font-mono">{selectedAutomation.automation_http_method}</Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-muted">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Capabilities & Data</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedAutomation.automation_keywords?.map((kw, i) => (
                            <Badge key={i} variant="secondary" className="bg-zinc-800 text-zinc-100 border-none px-3 py-1 text-[10px] font-bold">
                                {kw}
                            </Badge>
                        ))}
                    </div>
                </div>
            </div>
        )}
      </SidePeek>
    </>
  );
};
