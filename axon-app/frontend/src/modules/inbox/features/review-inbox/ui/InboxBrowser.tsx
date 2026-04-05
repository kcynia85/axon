"use client";

import React from "react";
import { SortOption } from "@/shared/domain/filters";
import { InboxItem } from "../../../domain";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { InboxListView } from "./InboxListView";

interface InboxBrowserProps {
  readonly initialItems: readonly InboxItem[];
}

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
  { id: "title-asc", label: "Title (A-Z)" },
  { id: "title-desc", label: "Title (Z-A)" },
];

export const InboxBrowser: React.FC<InboxBrowserProps> = ({ initialItems }) => {
  const filterItems = (items: readonly InboxItem[], query: string, filterIds: string[]) => {
    return items.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(query.toLowerCase()) || 
                           item.projectName.toLowerCase().includes(query.toLowerCase());
      if (!matchesSearch) return false;

      if (filterIds.length === 0) return true;

      const statusFilters = filterIds.filter(id => ['DRAFT', 'REVIEW', 'APPROVED', 'REJECTED'].includes(id));
      const typeFilters = filterIds.filter(id => ['DOCUMENT', 'CODE', 'IMAGE'].includes(id));

      if (statusFilters.length > 0 && !statusFilters.includes(item.status)) return false;
      if (typeFilters.length > 0 && !typeFilters.includes(item.type)) return false;

      return true;
    });
  };

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
    getFilteredItems,
    getPreviewCount,
    setPendingFilterIds,
  } = useResourceFilters<InboxItem>({
    filterItems,
    initialSortBy: "date-desc",
    initialFilterGroups: [
      {
        id: "status",
        title: "Status:",
        type: "checkbox",
        options: [
          { id: "DRAFT", label: "Draft", isChecked: false },
          { id: "REVIEW", label: "Review", isChecked: false },
          { id: "APPROVED", label: "Approved", isChecked: false },
          { id: "REJECTED", label: "Rejected", isChecked: false },
        ]
      },
      {
        id: "type",
        title: "Type:",
        type: "checkbox",
        options: [
          { id: "DOCUMENT", label: "Document", isChecked: false },
          { id: "CODE", label: "Code", isChecked: false },
          { id: "IMAGE", label: "Image", isChecked: false },
        ]
      }
    ]
  });

  const handleApprove = (id: string) => {
    console.log(`Approving item ${id}`);
    // Implementation for React 19 Actions would go here
  };

  const handleReject = (id: string) => {
    console.log(`Rejecting item ${id}`);
    // Implementation for React 19 Actions would go here
  };

  // Derived state - React Compiler handles optimization
  const filteredItems = getFilteredItems(initialItems);
  
  filteredItems.sort((a, b) => {
    switch (sortBy) {
      case "title-asc": return a.title.localeCompare(b.title);
      case "title-desc": return b.title.localeCompare(a.title);
      case "date-asc": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "date-desc": return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default: return 0;
    }
  });

  return (
    <InboxListView 
        items={filteredItems}
        totalItemsCount={getPreviewCount(initialItems)}
        searchQuery={searchQuery}
        sortBy={sortBy}
        sortOptions={SORT_OPTIONS}
        activeFilters={activeFilters}
        filterGroups={filterGroups}
        onSearchChange={setSearchQuery}
        onSortChange={setSortBy}
        onToggleFilter={handleToggleFilter}
        onRemoveFilter={handleRemoveFilter}
        onClearAllFilters={handleClearAll}
        onApplyFilters={handleApplyFilters}
        onSelectionChange={setPendingFilterIds}
        onApprove={handleApprove}
        onReject={handleReject}
    />
  );
};
