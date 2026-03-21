"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import type { SortDescriptor } from "@heroui/react";
import type { Tool, ToolRunResult } from "../../domain/tool.types";
import type { FilterGroup, SortOption } from "@/shared/domain/filters";

export const useToolsRegistry = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  const [params, setParams] = useState<Record<string, string>>({});
  const [result, setResult] = useState<ToolRunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  
  // Table States
  const [page, setPage] = useState(1);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedStatuses, setSelectedStatus] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "function_name",
    direction: "ascending",
  });
  const rowsPerPage = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/tools");
      if (!res.ok) throw new Error("Failed to load tools");
      const json = await res.json();
      return json.tools as Tool[];
    },
  });

  const tools = data || [];

  // Filter Groups Generation
  const filterGroups = useMemo((): FilterGroup[] => {
    const statuses = ["draft", "in_progress", "production"];
    const keywords = Array.from(new Set(tools.flatMap(t => t.keywords || [])))
      .filter(k => k !== "python" && k !== "synced")
      .sort();

    return [
      {
        id: "status",
        title: "Status",
        type: "checkbox",
        options: statuses.map(s => ({
          id: `status:${s}`,
          label: s === "draft" ? "In Draft" : s.replace(/_/g, ' '),
          isChecked: selectedStatuses.includes(s)
        }))
      },
      {
        id: "keywords",
        title: "Keywords",
        type: "checkbox",
        options: keywords.map(k => ({
          id: `keyword:${k}`,
          label: `#${k.toLowerCase()}`,
          isChecked: selectedKeywords.includes(k)
        }))
      }
    ];
  }, [tools, selectedStatuses, selectedKeywords]);

  const handleApplyFilters = useCallback((selectedIds: string[]) => {
    const statuses: string[] = [];
    const keywords: string[] = [];
    
    selectedIds.forEach(id => {
      if (id.startsWith("status:")) statuses.push(id.replace("status:", ""));
      if (id.startsWith("keyword:")) keywords.push(id.replace("keyword:", ""));
    });
    
    setSelectedStatus(statuses);
    setSelectedKeywords(keywords);
    setPage(1);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedStatus([]);
    setSelectedKeywords([]);
    setPage(1);
  }, []);

  const activeFilters = useMemo(() => {
    const filters = [];
    selectedStatuses.forEach(s => {
      filters.push({
        id: `status:${s}`,
        label: s === "draft" ? "In Draft" : s.replace(/_/g, ' '),
        category: "Status"
      });
    });
    selectedKeywords.forEach(k => {
      filters.push({
        id: `keyword:${k}`,
        label: `#${k.toLowerCase()}`,
        category: "Keyword"
      });
    });
    return filters;
  }, [selectedStatuses, selectedKeywords]);

  const handleRemoveFilter = useCallback((id: string) => {
    if (id.startsWith("status:")) {
      const val = id.replace("status:", "");
      setSelectedStatus(prev => prev.filter(s => s !== val));
    }
    if (id.startsWith("keyword:")) {
      const val = id.replace("keyword:", "");
      setSelectedKeywords(prev => prev.filter(k => k !== val));
    }
    setPage(1);
  }, []);

  // Sorting Options
  const sortOptions: SortOption[] = [
    { id: "function_name:asc", label: "Identity (A-Z)" },
    { id: "function_name:desc", label: "Identity (Z-A)" },
    { id: "status:asc", label: "Status (A-Z)" },
    { id: "status:desc", label: "Status (Z-A)" },
  ];

  const activeSortId = `${sortDescriptor.column}:${sortDescriptor.direction === "ascending" ? "asc" : "desc"}`;

  const handleSortChange = useCallback((id: string) => {
    const [column, direction] = id.split(":");
    setSortDescriptor({
      column,
      direction: direction === "asc" ? "ascending" : "descending"
    });
  }, []);

  const filteredItems = useMemo(() => {
    let filtered = tools.filter((t) => {
      const matchesSearch = t.function_name.toLowerCase().includes(searchFilter.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchFilter.toLowerCase());
      
      const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(t.status);
      
      const toolKeywords = t.keywords || [];
      const matchesKeywords = selectedKeywords.length === 0 || 
                             selectedKeywords.some(k => toolKeywords.includes(k));

      return matchesSearch && matchesStatus && matchesKeywords;
    });

    filtered = [...filtered].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Tool] || "";
      const second = b[sortDescriptor.column as keyof Tool] || "";
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    return filtered;
  }, [tools, searchFilter, selectedStatuses, selectedKeywords, sortDescriptor]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const handleSelectTool = (tool: Tool | null) => {
    setSelectedTool(tool);
    setParams({});
    setResult(null);
    setTestSuccess(false);
  };

  const { refetch } = useQuery({
    queryKey: ["tools"],
    queryFn: async () => {
      const res = await fetch("http://localhost:8081/api/tools");
      if (!res.ok) throw new Error("Failed to load tools");
      const json = await res.json();
      return json.tools as Tool[];
    },
  });

  const handleUpdateStatus = async (status: string) => {
    if (!selectedTool) return;
    try {
      const res = await fetch(`http://localhost:8081/api/update-tool-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool_name: selectedTool.name, status }),
      });
      if (res.ok) {
        setSelectedTool(prev => prev ? { ...prev, status } : null);
        await refetch();
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleRunTool = async () => {
    if (!selectedTool) return;
    setIsRunning(true);
    setTestSuccess(false);
    try {
      const res = await fetch(`http://localhost:8081/api/tools/${selectedTool.name}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ params }),
      });
      const data = await res.json();
      setResult(data);
      if (res.ok && !data.error) setTestSuccess(true);
    } catch (err: any) {
      setResult({ error: err.message || "Failed to execute" });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSyncTool = async () => {
    if (!selectedTool) return;
    setIsSyncing(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/resources/internal-tools/sync-remote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          file_name: selectedTool.file_path,
          file_content: "", 
          author: "local-dev"
        })
      });
      if (res.ok) alert("Zsynchronizowano z Axon!");
      else {
        const err = await res.json();
        alert(`Błąd: ${err.detail}`);
      }
    } catch (err: any) {
      alert("Błąd synchronizacji");
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    tools,
    items,
    isLoading,
    error,
    selectedTool,
    params,
    result,
    isRunning,
    isSyncing,
    testSuccess,
    page,
    searchFilter,
    sortDescriptor,
    pages,
    filterGroups,
    filteredItems,
    activeFilters,
    sortOptions,
    activeSortId,
    setPage,
    setSearchFilter,
    setSortDescriptor,
    setParams,
    handleSelectTool,
    handleUpdateStatus,
    handleRunTool,
    handleSyncTool,
    handleApplyFilters,
    handleClearFilters,
    handleRemoveFilter,
    handleSortChange,
  };
};
