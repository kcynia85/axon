'use client';

import React, { useState, useMemo } from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { FileText, FileCode, File, ExternalLink, LucideIcon } from "lucide-react";
import { ResourceCard } from "@/shared/ui/complex/ResourceCard";
import { ResourceList } from "@/shared/ui/complex/ResourceList";
import { TagChip } from "@/shared/ui/ui/TagChip";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";

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
        title: "Type",
        type: "checkbox",
        options: [
            { id: "markdown", label: "Markdown", isChecked: false },
            { id: "document", label: "Document", isChecked: false },
            { id: "code", label: "Code", isChecked: false },
            { id: "pdf", label: "PDF", isChecked: false },
        ]
    },
    {
        id: "tag",
        title: "Tag",
        type: "checkbox",
        options: [
            { id: "discovery", label: "Discovery", isChecked: false },
            { id: "design", label: "Design", isChecked: false },
            { id: "growth", label: "Growth & Market", isChecked: false },
            { id: "delivery", label: "Delivery", isChecked: false },
            { id: "general", label: "#general", isChecked: false },
        ]
    }
];

// Mock Active Filters from Breadboard
const INITIAL_ACTIVE_FILTERS: ActiveFilter[] = [];

const getResourceIcon = (type: string): LucideIcon => {
    switch (type) {
        case "markdown": return FileText;
        case "code": return FileCode;
        case "pdf": return File;
        default: return File;
    }
};

export const KnowledgeBrowser = () => {
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>(INITIAL_ACTIVE_FILTERS);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[]>([]);

  const handleRemoveFilter = (id: string) => {
    setActiveFilters(prev => prev.filter(f => f.id !== id));
    setPendingFilterIds(prev => prev.filter(pId => pId !== id));
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds([]);
  };

  const handleApplyFilters = (selectedIds: string[]) => {
      const nextFilters: ActiveFilter[] = [];
      FILTER_GROUPS.forEach(group => {
          group.options.forEach(opt => {
              if (selectedIds.includes(opt.id)) {
                  nextFilters.push({ id: opt.id, label: opt.label, category: group.id });
              }
          });
      });
      setActiveFilters(nextFilters);
      setPendingFilterIds(selectedIds);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
      setPendingFilterIds(selectedIds);
  };

  const handleToggleFilter = (id: string) => {
      const option = FILTER_GROUPS.flatMap(g => g.options.map(o => ({...o, groupId: g.id}))).find(o => o.id === id);
      if (option) {
          if (activeFilters.some(f => f.id === id)) {
              handleRemoveFilter(id);
          } else {
              setActiveFilters([...activeFilters, { id: option.id, label: option.label, category: option.groupId }]);
              setPendingFilterIds([...pendingFilterIds, id]);
          }
      }
  };

  const previewCount = useMemo(() => {
    let result = MOCK_RESOURCES.filter(r => !pendingIds.has(r.id));
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => r.title.toLowerCase().includes(query));
    }

    if (pendingFilterIds.length > 0) {
        result = result.filter(r => {
            const matchesType = pendingFilterIds.includes(r.type);
            const matchesTag = r.tags.some(t => pendingFilterIds.includes(t.toLowerCase()));
            return matchesType || matchesTag;
        });
    }

    return result.length;
  }, [searchQuery, pendingFilterIds, pendingIds]);

  const filteredResources = useMemo(() => {
    let result = MOCK_RESOURCES.filter(r => !pendingIds.has(r.id));

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        result = result.filter(r => r.title.toLowerCase().includes(query));
    }

    if (activeFilters.length > 0) {
        result = result.filter(r => {
            const matchesType = activeFilters.some(f => f.id === r.type);
            const matchesTag = r.tags.some(t => activeFilters.some(f => f.id === t.toLowerCase()));
            return matchesType || matchesTag;
        });
    }

    return result;
  }, [pendingIds, searchQuery, activeFilters]);

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
          onApplyFilters={handleApplyFilters} 
          onSelectionChange={handleSelectionChange}
          onClearAllFilters={handleClearAll}
          onPendingFilterIdsChange={handleSelectionChange}
          resultsCount={previewCount}
          sortOptions={SORT_OPTIONS}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      }
    >
      <ResourceList
        items={filteredResources}
        isLoading={false}
        viewMode={viewMode}
        renderItem={(resource) => (
            <ResourceCard
                key={resource.id}
                title={resource.title}
                description={null}
                href="#"
                icon={getResourceIcon(resource.type)}
                categories={resource.tags}
                onEdit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Edit resource", resource.id);
                }}
                onDelete={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    deleteWithUndo(resource.id, resource.title, () => {
                        console.log("Permanently delete resource from Knowledge base", resource.id);
                    });
                }}
            />
        )}
      />
    </BrowserLayout>
  );
};
