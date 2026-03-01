"use client";

import { useState, useMemo } from "react";
import { Template } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

export function useTemplatesBrowser(initialTemplates: Template[] = []) {
  const [viewMode, setViewMode] = useViewMode("templates", "grid");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterConfig = useResourceFilters<Template>({
    initialSortBy: "name-asc",
    initialFilterGroups: [
      {
        id: "categories",
        title: "Category",
        type: "checkbox",
        options: [
          { id: "PRD", label: "PRD", isChecked: false },
          { id: "SOP", label: "SOP", isChecked: false },
          { id: "Analysis", label: "Analysis", isChecked: false },
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
            item.category?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => filterIds.includes(item.category));
      }

      return filtered;
    },
  });

  const processedTemplates = useMemo(() => {
    return filterConfig.getFilteredItems(initialTemplates);
  }, [filterConfig, initialTemplates]);

  return {
    templates: initialTemplates,
    processedTemplates,
    viewMode,
    setViewMode,
    selectedTemplateId,
    isSidebarOpen,
    setIsSidebarOpen,
    filterConfig,
  };
}
