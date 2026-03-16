"use client";

import { useState, useMemo } from "react";
import { Crew } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

export function useCrewsBrowser(initialCrews: Crew[] = []) {
  const [viewMode, setViewMode] = useViewMode("crews", "grid");
  const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterConfig = useResourceFilters<Crew>({
    initialSortBy: "name-asc",
    initialFilterGroups: [
      {
        id: "process-types",
        title: "Process Type",
        type: "checkbox",
        options: [
          { id: "Sequential", label: "Sequential", isChecked: false },
          { id: "Hierarchical", label: "Hierarchical", isChecked: false },
          { id: "Parallel", label: "Parallel", isChecked: false },
        ],
      },
    ],
    filterItems: (items, query, filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.crew_name?.toLowerCase().includes(lowQuery) ||
            item.crew_description?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => filterIds.includes(item.crew_process_type));
      }

      return filtered;
    },
  });

  const processedCrews = useMemo(() => {
    return filterConfig.getFilteredItems(initialCrews);
  }, [filterConfig, initialCrews]);

  const handleViewDetails = (id: string) => {
    setSelectedCrewId(id);
    setIsSidebarOpen(true);
  };

  return {
    crews: initialCrews,
    processedCrews,
    viewMode,
    setViewMode,
    selectedCrewId,
    setSelectedCrewId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  };
}
