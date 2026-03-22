'use client';

import React, { useState } from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { FileText, FileCode, File, ExternalLink, LucideIcon } from "lucide-react";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { TagChip } from "@/shared/ui/ui/TagChip";

// Mock Data
const MOCK_RESOURCES = [
  { id: "1", title: "Roadmap_2025.md", tags: ["Discovery", "Design"], type: "markdown" },
  { id: "2", title: "Competitor Analysis", tags: ["Growth & Market"], type: "document" },
  { id: "3", title: "backend_api.py", tags: ["Delivery"], type: "code" },
  { id: "4", title: "Legacy_Specs.pdf", tags: ["Delivery", "#general"], type: "pdf" },
];

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Type", groupId: "type" },
  { label: "By Tag", groupId: "tag" },
];

const FILTER_GROUPS: readonly FilterGroup[] = [
    {
        id: "type",
        label: "Type",
        options: [
            { id: "markdown", label: "Markdown" },
            { id: "document", label: "Document" },
            { id: "code", label: "Code" },
            { id: "pdf", label: "PDF" },
        ]
    },
    {
        id: "tag",
        label: "Tag",
        options: [
            { id: "discovery", label: "Discovery" },
            { id: "design", label: "Design" },
            { id: "growth", label: "Growth & Market" },
            { id: "delivery", label: "Delivery" },
            { id: "general", label: "#general" },
        ]
    }
];

// Mock Active Filters from Breadboard
const INITIAL_ACTIVE_FILTERS: ActiveFilter[] = [
    { id: "hub-product", label: "Hub Product", groupId: "hub" },
    { id: "strat-general", label: "Strat: General", groupId: "strat" }
];

const getResourceIcon = (type: string): LucideIcon => {
    switch (type) {
        case "markdown": return FileText;
        case "code": return FileCode;
        case "pdf": return File;
        default: return File;
    }
};

export const KnowledgeBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(INITIAL_ACTIVE_FILTERS);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
  };

  const handleToggleFilter = (id: string) => {
      const option = FILTER_GROUPS.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
      if (option) {
          if (activeFilters.some(f => f.id === id)) {
              handleRemoveFilter(id);
          } else {
              setActiveFilters([...activeFilters, { id: option.id, label: option.label, groupId: option.groupId }]);
          }
      }
  };

  return (
    <BrowserLayout
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      searchPlaceholder="Search knowledge base..."
      activeFilters={activeFilters.length > 0 && (
        <FilterBar 
          activeFilters={activeFilters}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      )}
      actionBar={
        <ActionBar 
          filterGroups={FILTER_GROUPS}
          activeFilters={activeFilters}
          quickFilters={QUICK_FILTERS}
          onToggleFilter={handleToggleFilter}
          onApplyFilters={() => {}} 
          onClearAllFilters={handleClearAll}
          resultsCount={MOCK_RESOURCES.length}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      <ResourceList
        items={MOCK_RESOURCES}
        isLoading={false}
        viewMode={viewMode}
        renderItem={(resource) => (
            <ResourceCard
                key={resource.id}
                title={resource.title}
                description={null}
                href="#"
                icon={getResourceIcon(resource.type)}
                tags={resource.tags}
                // Custom rendering for tags if ResourceCard supported render prop for tags, 
                // but since we need 'category' variant and ResourceCard uses default, 
                // we might accept that for now or assume ResourceCard has been updated globally.
                // However, user specifically asked for "To samo stylowanie" (The same styling).
                // Tools uses ResourceCard. So using ResourceCard is the correct path for consistency.
            />
        )}
      />
    </BrowserLayout>
  );
};
