"use client";

import { useState, useMemo } from "react";
import { Pattern } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

/**
 * usePatternsBrowser: Hook for filtering and viewing patterns.
 * Standard: 0% useEffect, arrow function.
 */
export const usePatternsBrowser = (initialPatterns: Pattern[] = []) => {
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
    filterItems: (items, query, _filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.pattern_name?.toLowerCase().includes(lowQuery) ||
            item.pattern_okr_context?.toLowerCase().includes(lowQuery)
        );
      }

      // Temporarily disabled type filter as it's not in the main schema
      // if (filterIds.length > 0) {
      //   filtered = filtered.filter((item) => filterIds.includes((item as any).type));
      // }

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
};
