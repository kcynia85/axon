'use client';

import React, { useState } from "react";
import { usePromptsBrowser } from "../application/usePromptsBrowser";
import { PromptArchetype } from "@/shared/domain/resources";
import { useDeletePromptArchetype } from "../application/usePromptArchetypes";
import { useArchetypeDraft } from "@/modules/studio/features/archetypes/application/useArchetypeDraft";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { useQuery } from "@tanstack/react-query";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";
import { PromptsBrowserView } from "./PromptsBrowserView";
import { SortOption } from "@/shared/domain/filters";
import { QuickFilter } from "@/shared/ui/complex/ActionBar";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "Product", groupId: "domain-product" },
  { label: "Marketing", groupId: "domain-marketing" },
];

interface PromptsBrowserProps {
  readonly initialPrompts?: PromptArchetype[];
}

export const PromptsBrowser = ({ initialPrompts = [] }: PromptsBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = (params?.workspace as string) || "ws-product";

  const { draft, clearDraft } = useArchetypeDraft(workspaceId);
  const { pendingIds } = usePendingDeletionsStore();

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => [], // Fallback
  });

  const {
    prompts,
    processedPrompts,
    recentlyUsedPrompts,
    viewMode,
    setViewMode,
    isLoading,
    isError,
    selectedPrompt,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfiguration
  } = usePromptsBrowser(initialPrompts);

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    activeFilters,
    filterGroups,
    handleToggleFilter,
    handleRemoveFilter,
    handleClearAll,
    handleApplyFilters,
    getPreviewCount,
    setPendingFilterIds,
  } = filterConfiguration;

  const { mutate: deletePrompt } = useDeletePromptArchetype();
  const { deleteWithUndo } = useDeleteWithUndo();
  const [promptToDeleteId, setPromptToDeleteId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic archetypu usunięty");
      }
      return;
    }

    const prompt = prompts.find(p => p.id === id);
    const name = prompt?.archetype_name || "Archetype";
    deleteWithUndo(id, name, () => deletePrompt(id));
  };

  const confirmDelete = () => {
    if (promptToDeleteId) {
      deletePrompt(promptToDeleteId);
      setPromptToDeleteId(null);
      toast.success("Archetyp usunięty");
    }
  };

  const handleEdit = () => {
    if (selectedPrompt) {
      const id = selectedPrompt.id === "draft" ? "" : selectedPrompt.id;
      router.push(`/resources/archetypes/studio/${id}`);
    }
  };

  // Logic previously in useMemo, now handled directly (React Compiler will optimize)
  const getDisplayPrompts = () => {
    const activePrompts = processedPrompts.filter(p => !pendingIds.has(p.id));
    if (!draft) return activePrompts;
    
    const draftItem = {
      id: "draft",
      archetype_name: draft.name || "New Archetype",
      archetype_description: draft.description || "Resume design...",
      workspace_domain: "Draft",
      archetype_keywords: draft.keywords || [],
      isDraft: true
    } as unknown as PromptArchetype & { isDraft?: boolean };
    
    return [draftItem, ...activePrompts];
  };

  const getActivePrompt = () => {
    if (selectedPrompt?.id === "draft") {
        return {
            id: "draft",
            archetype_name: draft?.name || "New Archetype",
            archetype_description: draft?.description || "Resume design...",
            workspace_domain: "Draft",
            archetype_keywords: draft?.keywords || [],
            isDraft: true
        } as unknown as PromptArchetype & { isDraft?: boolean };
    }
    return selectedPrompt;
  };

  const displayPrompts = getDisplayPrompts();
  const activePrompt = getActivePrompt();
  const promptToDelete = processedPrompts.find(p => p.id === promptToDeleteId);

  return (
    <PromptsBrowserView
      prompts={prompts}
      displayPrompts={displayPrompts}
      recentlyUsedPrompts={recentlyUsedPrompts.filter(p => !pendingIds.has(p.id))}
      viewMode={viewMode}
      setViewMode={setViewMode}
      isLoading={isLoading}
      isError={isError}
      isSidebarOpen={isSidebarOpen}
      onSidebarOpenChange={setIsSidebarOpen}
      activePrompt={activePrompt}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      sortBy={sortBy}
      onSortChange={setSortBy}
      sortOptions={SORT_OPTIONS}
      activeFilters={activeFilters}
      filterGroups={filterGroups}
      quickFilters={QUICK_FILTERS}
      onToggleFilter={handleToggleFilter}
      onRemoveFilter={handleRemoveFilter}
      onClearAllFilters={handleClearAll}
      onApplyFilters={handleApplyFilters}
      onPendingFilterIdsChange={setPendingFilterIds}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewDetails={handleViewDetails}
      previewCount={getPreviewCount(prompts)}
      promptToDeleteId={promptToDeleteId}
      onConfirmDelete={confirmDelete}
      onCancelDelete={() => setPromptToDeleteId(null)}
      promptToDeleteName={promptToDelete?.archetype_name}
    />
  );
};
