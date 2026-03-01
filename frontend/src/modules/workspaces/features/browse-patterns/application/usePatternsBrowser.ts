"use client";

import { useState, useMemo } from "react";
import { Pattern } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

export function usePatternsBrowser(initialPatterns: Pattern[] = []) {
  const [viewMode, setViewMode] = useViewMode("patterns", "grid");
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterConfig = useResourceFilters<Pattern>({
    initialSortBy: "name-asc",
    initialFilterGroups: [
      {
        id: "types",
        title: "Type",
        type: "checkbox",
        options: [
          { id: "Pattern", label: "Pattern", isChecked: false },
          { id: "Reusable Template", label: "Reusable Template", isChecked: false },
        ],
      },
    ],
    filterItems: (items, query, filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.name?.toLowerCase().includes(lowQuery) ||
            item.description?.toLowerCase().includes(lowQuery) ||
            item.type?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => filterIds.includes(item.type));
      }

      return filtered;
    },
  });

  const processedPatterns = useMemo(() => {
    return filterConfig.getFilteredItems(initialPatterns);
  }, [filterConfig, initialPatterns]);

  return {
    patterns: initialPatterns,
    processedPatterns,
    viewMode,
    setViewMode,
    selectedPatternId,
    isSidebarOpen,
    setIsSidebarOpen,
    filterConfig,
  };
}
