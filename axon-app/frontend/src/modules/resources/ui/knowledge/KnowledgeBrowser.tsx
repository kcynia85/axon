'use client';

import React, { useState } from "react";
import { SortOption, ActiveFilter, FilterGroup } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";
import { KnowledgeBrowserView } from "./KnowledgeBrowserView";
import { KnowledgeResource } from "@/shared/domain/resources";
import { KnowledgeResourceSidePeek } from "./KnowledgeResourceSidePeek";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { resourcesApi } from "@/modules/resources/infrastructure/api";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/shared/ui/ui/Dialog";
import { Button } from "@/shared/ui/ui/Button";
import { AlertTriangle } from "lucide-react";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Type", groupId: "type" },
  { label: "By Hub", groupId: "hub" },
];

/**
 * KnowledgeBrowser: Main container for orchestrating knowledge resource browsing.
 * Standard: Container pattern, DDD mindset, 0% manual optimization.
 */
export const KnowledgeBrowser = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("date-desc");
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [pendingFilterIds, setPendingFilterIds] = useState<string[] | null>(null);

  // SidePeek State
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [isSidePeekOpen, setIsSidePeekOpen] = useState(false);

  // Delete Modal State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [resourceToDeleteId, setResourceToDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch Hubs for filtering
  const { data: knowledgeHubs = [] } = useQuery({
    queryKey: ["knowledge-hubs"],
    queryFn: () => resourcesApi.getKnowledgeHubs()
  });

  // Fetch real data from API with polling for indexing status
  const { data: sourceData = [], isLoading } = useQuery({
    queryKey: ["knowledge-resources"],
    queryFn: () => resourcesApi.getKnowledgeResources(),
    refetchInterval: (query) => {
        const resources = query.state.data as KnowledgeResource[];
        const hasIndexing = resources?.some(resource => 
            resource.resource_rag_indexing_status === "Indexing" || 
            resource.resource_rag_indexing_status === "Pending"
        );
        return hasIndexing ? 5000 : false;
    }
  });

  // Map API data to view model - ensuring unique IDs
  const seenResourceIds = new Set();
  const uniqueResources = sourceData.filter(resource => {
      if (seenResourceIds.has(resource.id)) return false;
      seenResourceIds.add(resource.id);
      return true;
  });

  const currentPendingIds = pendingFilterIds ?? activeFilters.map(activeFilter => activeFilter.id);

  const filterGroups: FilterGroup[] = [
    {
        id: "type",
        title: "Type",
        type: "checkbox",
        options: Array.from(new Set(uniqueResources.map(resource => resource.resource_file_format))).map(type => ({
            id: type,
            label: type.toUpperCase(),
            isChecked: currentPendingIds.includes(type)
        }))
    },
    {
        id: "hub",
        title: "Hub",
        type: "checkbox",
        options: knowledgeHubs.map(hub => ({
            id: hub.id,
            label: hub.hub_name,
            isChecked: currentPendingIds.includes(hub.id)
        }))
    },
    {
        id: "tag",
        title: "Tag",
        type: "checkbox",
        options: Array.from(new Set(uniqueResources.flatMap(resource => resource.resource_metadata?.tags || []))).slice(0, 15).map(tag => ({
            id: tag.toLowerCase(),
            label: `#${tag.toLowerCase()}`,
            isChecked: currentPendingIds.includes(tag.toLowerCase())
        }))
    }
  ];

  const getFilteredResults = (filterIds: string[]) => {
      const filtersByCategory: Record<string, string[]> = {};
      filterIds.forEach(filterId => {
          const matchingGroup = filterGroups.find(group => group.options.some(option => option.id === filterId));
          if (matchingGroup) {
              if (!filtersByCategory[matchingGroup.id]) filtersByCategory[matchingGroup.id] = [];
              filtersByCategory[matchingGroup.id].push(filterId);
          }
      });
      
      let results = [...uniqueResources];
      if (searchQuery) {
          const lowerCaseQuery = searchQuery.toLowerCase();
          results = results.filter(resource => resource.resource_file_name.toLowerCase().includes(lowerCaseQuery));
      }
      
      if (filterIds.length === 0) return results;

      return results.filter(resource => {
          return Object.entries(filtersByCategory).every(([category, selectedIds]) => {
              if (category === 'type') return selectedIds.includes(resource.resource_file_format);
              if (category === 'hub') return resource.knowledge_hub_id && selectedIds.includes(resource.knowledge_hub_id);
              if (category === 'tag') return (resource.resource_metadata?.tags || []).some(tag => selectedIds.includes(tag.toLowerCase()));
              return true;
          });
      });
  };

  const filteredResources = getFilteredResults(activeFilters.map(filter => filter.id));
  const pendingResources = getFilteredResults(currentPendingIds);
  const previewCount = pendingResources.length;

  const handleRemoveFilter = (id: string) => {
    const nextFilters = activeFilters.filter(activeFilter => activeFilter.id !== id);
    setActiveFilters(nextFilters);
    setPendingFilterIds(null);
  };

  const handleClearAll = () => {
    setActiveFilters([]);
    setPendingFilterIds(null);
  };

  const handleApplyFilters = (selectedIds: string[]) => {
      const nextFilters: ActiveFilter[] = [];
      filterGroups.forEach(group => {
          group.options.forEach(option => {
              if (selectedIds.includes(option.id)) {
                  nextFilters.push({ id: option.id, label: option.label, category: group.id });
              }
          });
      });
      setActiveFilters(nextFilters);
      setPendingFilterIds(null);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
      setPendingFilterIds(selectedIds);
  };

  const handleToggleFilter = (filterId: string) => {
      const selectedOption = filterGroups
        .flatMap(group => group.options.map(option => ({...option, groupId: group.id})))
        .find(option => option.id === filterId);

      if (selectedOption) {
          if (activeFilters.some(activeFilter => activeFilter.id === filterId)) {
              handleRemoveFilter(filterId);
          } else {
              const nextFilters = [...activeFilters, { id: selectedOption.id, label: selectedOption.label, category: selectedOption.groupId }];
              setActiveFilters(nextFilters);
              setPendingFilterIds(null);
          }
      }
  };

  const handleResourceClick = (resourceId: string) => {
    setSelectedResourceId(resourceId);
    setIsSidePeekOpen(true);
  };

  const handleDeleteTrigger = (id: string) => {
    setResourceToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!resourceToDeleteId) return;
    
    try {
        await resourcesApi.deleteKnowledgeResource(resourceToDeleteId);
        queryClient.invalidateQueries({ queryKey: ["knowledge-resources"] });
        toast.success(`Zasób został usunięty.`);
        setIsSidePeekOpen(false);
    } catch (error) {
        console.error("Failed to delete resource", error);
        toast.error("Wystąpił błąd podczas usuwania zasobu.");
    } finally {
        setIsDeleteDialogOpen(false);
        setResourceToDeleteId(null);
    }
  };

  // Sort logic
  if (sortBy === "name-asc") filteredResources.sort((a, b) => a.resource_file_name.localeCompare(b.resource_file_name));
  if (sortBy === "name-desc") filteredResources.sort((a, b) => b.resource_file_name.localeCompare(a.resource_file_name));

  return (
    <>
        <KnowledgeBrowserView
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            activeFilters={activeFilters}
            filterGroups={filterGroups}
            quickFilters={QUICK_FILTERS}
            sortOptions={SORT_OPTIONS}
            onToggleFilter={handleToggleFilter}
            onRemoveFilter={handleRemoveFilter}
            onClearAllFilters={handleClearAll}
            onApplyFilters={handleApplyFilters}
            onSelectionChange={handleSelectionChange}
            filteredResources={filteredResources.map(resource => ({
                id: resource.id,
                title: resource.resource_file_name,
                type: resource.resource_file_format,
                tags: resource.resource_metadata?.tags || [],
                status: resource.resource_rag_indexing_status as any,
                vectorDatabaseName: resource.vector_database_name,
                hubName: resource.hub_name,
                hubId: resource.knowledge_hub_id || undefined,
                chunkCount: resource.resource_chunk_count
            }))}
            previewCount={previewCount}
            onDelete={() => {}}
            onEdit={() => {}}
            onResourceClick={(resource) => handleResourceClick(resource.id)}
            isLoading={isLoading}
        />
        <KnowledgeResourceSidePeek 
            resourceId={selectedResourceId}
            isOpen={isSidePeekOpen}
            onClose={() => setIsSidePeekOpen(false)}
            onDelete={handleDeleteTrigger}
        />

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="max-w-md border-zinc-800 bg-zinc-950">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-500 font-mono uppercase tracking-widest text-base">
                        <AlertTriangle className="w-5 h-5" />
                        Usuwanie Zasobu
                    </DialogTitle>
                    <DialogDescription className="py-4 text-zinc-400">
                        Czy na pewno chcesz trwale usunąć ten zasób z bazy wiedzy? Tej operacji nie można cofnąć.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="gap-2 border-t border-zinc-900 pt-4">
                    <Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} className="text-zinc-500 hover:text-white">
                        Anuluj
                    </Button>
                    <Button 
                        variant="destructive" 
                        onClick={confirmDelete}
                        className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-bold"
                    >
                        Tak, usuń
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
};
