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
        id: "tools",
        title: "Narzędzia",
        type: "checkbox",
        options: [
          { id: "model-gpt4o", label: "GPT-4o", isChecked: false },
          { id: "model-gpt4o-mini", label: "GPT-4o Mini", isChecked: false },
          { id: "model-claude-sonnet", label: "Claude 3.5 Sonnet", isChecked: false },
        ],
      },
      {
        id: "strength",
        title: "Siła",
        type: "checkbox",
        options: [
          { id: "lead", label: "Lead", isChecked: false },
          { id: "specialist", label: "Specialist", isChecked: false },
          { id: "senior", label: "Senior", isChecked: false },
        ],
      },
      {
        id: "roles",
        title: "Rola",
        type: "checkbox",
        options: [
          { id: "product", label: "Product", isChecked: false },
          { id: "engineering", label: "Engineering", isChecked: false },
          { id: "design", label: "Design", isChecked: false },
          { id: "research", label: "Research", isChecked: false },
        ],
      },
      {
        id: "status",
        title: "Status",
        type: "checkbox",
        options: [
          { id: "active", label: "Aktywny", isChecked: false },
          { id: "idle", label: "Bezczynny", isChecked: false },
          { id: "offline", label: "Offline", isChecked: false },
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
            item.agent_role_text?.toLowerCase().includes(lowQuery) ||
            item.agent_goal?.toLowerCase().includes(lowQuery)
        );
      }

      if (filterIds.length > 0) {
        filtered = filtered.filter((item) => {
          const itemAttributes = [
            item.llm_model_id?.toLowerCase(),
            item.agent_role_text?.toLowerCase(),
            ...(item.agent_keywords || []).map(k => k.toLowerCase()),
            // Status is mocked for now as it's not in the schema
            "active" 
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
