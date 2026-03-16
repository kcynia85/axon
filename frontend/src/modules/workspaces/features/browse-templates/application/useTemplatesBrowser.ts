"use client";

import { useState, useMemo } from "react";
import { Template } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

/**
 * useTemplatesBrowser: Logic for filtering and viewing templates.
 * Standard: 0% useEffect, arrow functions.
 */
export const useTemplatesBrowser = (initialTemplates: Template[] = []) => {
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
    filterItems: (items, query, _filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.template_name?.toLowerCase().includes(lowQuery) ||
            item.template_description?.toLowerCase().includes(lowQuery)
        );
      }

      // Temporarily disabled category filter as it's not in the main schema
      // if (filterIds.length > 0) {
      //   filtered = filtered.filter((item) => filterIds.includes((item as any).category));
      // }

      return filtered;
    },
  });

  const processedTemplates = useMemo(() => {
    return filterConfig.getFilteredItems(initialTemplates);
  }, [filterConfig, initialTemplates]);

  const handleViewDetails = (id: string) => {
    setSelectedTemplateId(id);
    setIsSidebarOpen(true);
  };

  return {
    templates: initialTemplates,
    processedTemplates,
    viewMode,
    setViewMode,
    selectedTemplateId,
    setSelectedTemplateId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  };
};
