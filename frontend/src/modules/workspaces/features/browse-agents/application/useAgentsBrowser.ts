"use client";

import { useState, useMemo } from "react";
import { Agent } from "@/shared/domain/workspaces";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";

export function useAgentsBrowser(initialAgents: Agent[] = []) {
  const [viewMode, setViewMode] = useViewMode("agents", "grid");
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filterConfig = useResourceFilters<Agent>({
    initialSortBy: "name-asc",
    initialFilterGroups: [
      {
        id: "roles",
        title: "Role",
        type: "checkbox",
        options: [
          { id: "product-owner", label: "Product Owner", isChecked: false },
          { id: "technical-writer", label: "Technical Writer", isChecked: false },
          { id: "researcher", label: "Researcher", isChecked: false },
        ],
      },
      {
        id: "keywords",
        title: "Keywords",
        type: "checkbox",
        options: [
          { id: "product", label: "#product", isChecked: false },
          { id: "strategy", label: "#strategy", isChecked: false },
          { id: "documentation", label: "#documentation", isChecked: false },
        ],
      },
    ],
    filterItems: (items, query, filterIds) => {
      let filtered = [...items];

      if (query) {
        const lowQuery = query.toLowerCase();
        filtered = filtered.filter(
          (item) =>
            item.agent_name?.toLowerCase().includes(lowQuery) ||
            item.role?.toLowerCase().includes(lowQuery) ||
            item.goal?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => {
          const itemTags = [
            item.role?.toLowerCase(),
            ...(item.keywords || []).map(k => k.toLowerCase())
          ];
          return filterIds.some(id => itemTags.includes(id.toLowerCase()));
        });
      }

      return filtered;
    },
  });

  const processedAgents = useMemo(() => {
    return filterConfig.getFilteredItems(initialAgents);
  }, [filterConfig, initialAgents]);

  const handleViewDetails = (id: string) => {
    setSelectedAgentId(id);
    setIsSidebarOpen(true);
  };

  return {
    agents: initialAgents,
    processedAgents,
    viewMode,
    setViewMode,
    selectedAgentId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  };
}
