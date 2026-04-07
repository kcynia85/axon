'use client';

import React, { useState } from "react";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { KnowledgeBrowserView } from "./KnowledgeBrowserView";
import { KnowledgeResource } from "./KnowledgeBrowserView.types";

// Mock Data
const MOCK_RESOURCES: KnowledgeResource[] = [
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

export const KnowledgeBrowser = () => {
  const { deleteWithUndo } = useDeleteWithUndo();
  const { pendingIds } = usePendingDeletionsStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
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

  const handleDelete = (resource: KnowledgeResource) => {
    deleteWithUndo(resource.id, resource.title, () => {
        console.log("Permanently delete resource", resource.id);
    });
  };

  const handleEdit = (resource: KnowledgeResource) => {
    console.log("Edit resource", resource.id);
  };

  // Logic previously in useMemo, now handled directly (React Compiler will optimize)
  const getFilteredResources = () => {
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
  };

  const filteredResources = getFilteredResources();
  const previewCount = filteredResources.length;

  return (
    <KnowledgeBrowserView
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      viewMode={viewMode}
      setViewMode={setViewMode}
      sortBy={sortBy}
      onSortChange={setSortBy}
      activeFilters={activeFilters}
      filterGroups={FILTER_GROUPS}
      quickFilters={QUICK_FILTERS}
      sortOptions={SORT_OPTIONS}
      onToggleFilter={handleToggleFilter}
      onRemoveFilter={handleRemoveFilter}
      onClearAllFilters={handleClearAll}
      onApplyFilters={handleApplyFilters}
      onSelectionChange={handleSelectionChange}
      filteredResources={filteredResources}
      previewCount={previewCount}
      onDelete={handleDelete}
      onEdit={handleEdit}
    />
  );
};
