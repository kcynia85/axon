"use client";

import React, { useMemo } from "react";
import { WorkspacesList } from "@/modules/workspaces/ui/WorkspacesList";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { useWorkspaces } from "@/modules/workspaces/application/useWorkspaces";
import { shouldShowPagination } from "@/shared/lib/pagination";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { useViewMode } from "@/shared/lib/hooks/useViewMode";
import { Workspace } from "@/shared/domain/workspaces";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/shared/lib/utils";

export default function WorkspacesPage() {
  const { data: workspaces, isLoading, isError } = useWorkspaces();
  const [viewMode, setViewMode] = useViewMode("workspaces", "grid");

  const filterItems = (items: readonly Workspace[], query: string) => {
    return items.filter(workspace => {
      const name = (workspace.name || "").toLowerCase();
      const description = (workspace.description || "").toLowerCase();
      return name.includes(query.toLowerCase()) || description.includes(query.toLowerCase());
    });
  };

  const {
    searchQuery,
    setSearchQuery,
    getFilteredItems,
  } = useResourceFilters<Workspace>({
    filterItems,
  });

  const filteredWorkspaces = useMemo(() => {
    if (!workspaces) return [];
    return getFilteredItems(workspaces);
  }, [workspaces, getFilteredItems]);

  const showPagination = workspaces ? shouldShowPagination(workspaces.length) : false;

  return (
    <ModulePageLayout
        title="Workspaces"
        description="Manage your AI agents and crews in isolated environments."
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Workspaces" }
        ]}
        pagination={null}
        showPagination={showPagination}
    >
        <BrowserLayout
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search workspaces..."
            actions={
                <div className="flex items-center gap-6 mb-[-10px]">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2",
                      viewMode === 'grid' 
                        ? "border-black dark:border-white text-black dark:text-white" 
                        : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <LayoutGrid size={14} />
                    Grid
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] border-b-2 transition-all pb-2",
                      viewMode === 'list' 
                        ? "border-black dark:border-white text-black dark:text-white" 
                        : "border-transparent text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
                    )}
                  >
                    <List size={14} />
                    List
                  </button>
                </div>
            }
        >
            <WorkspacesList 
                workspaces={filteredWorkspaces} 
                isLoading={isLoading} 
                isError={isError} 
                viewMode={viewMode}
            />
        </BrowserLayout>
    </ModulePageLayout>
  );
}
