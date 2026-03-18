"use client";

import { useState, useMemo } from "react";
import { ExternalService as Service } from "@/shared/domain/resources";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

export function useServicesBrowser(initialServices: Service[] = []) {
  const [viewMode, setViewMode] = useViewMode("services", "grid");
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterConfig = useResourceFilters<Service>({
    initialSortBy: "name-asc",
    initialFilterGroups: [
      {
        id: "categories",
        title: "Kategorie",
        type: "checkbox",
        options: [
          { id: "GenAI", label: "GenAI", isChecked: false },
          { id: "Utility", label: "Utility", isChecked: false },
          { id: "Scraping", label: "Scraping", isChecked: false },
          { id: "Business", label: "Business", isChecked: false },
        ],
      },
      {
        id: "status",
        title: "Status",
        type: "checkbox",
        options: [
          { id: "active", label: "Aktywny", isChecked: false },
          { id: "maintenance", label: "Prace serwisowe", isChecked: false },
        ],
      },
    ],
    filterItems: (items, query, filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.service_name.toLowerCase().includes(lowQuery) ||
            item.service_category.toLowerCase().includes(lowQuery) ||
            item.service_description?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => {
          const itemAttributes = [
            item.service_category.toLowerCase(),
            ...(item.service_keywords || []).map(k => k.toLowerCase()),
            "active" // Mock status
          ];
          
          return filterIds.some(id => {
            const lowId = id.toLowerCase();
            return itemAttributes.some(attr => attr?.includes(lowId));
          });
        });
      }

      return filtered;
    },
  });

  const processedServices = useMemo(() => {
    return filterConfig.getFilteredItems(initialServices);
  }, [filterConfig, initialServices]);

  const handleViewDetails = (id: string) => {
    setSelectedServiceId(id);
    setIsSidebarOpen(true);
  };

  return {
    services: initialServices,
    processedServices,
    viewMode,
    setViewMode,
    selectedServiceId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  };
}
