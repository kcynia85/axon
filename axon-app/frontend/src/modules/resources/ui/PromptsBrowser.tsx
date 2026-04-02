'use client';

import React from "react";
import { Edit2, Trash2, BookOpen } from "lucide-react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { usePromptsBrowser } from "../application/usePromptsBrowser";
import { PromptsBrowserContent } from "./components/PromptsBrowserContent";
import { RecentlyUsedPrompts } from "./components/RecentlyUsedPrompts";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { PromptArchetype } from "@/shared/domain/resources";
import { Badge } from "@/shared/ui/ui/Badge";
import { useDeletePromptArchetype } from "../application/usePromptArchetypes";
import { useArchetypeDraft } from "@/modules/studio/features/archetypes/application/useArchetypeDraft";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/ui/Button";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useQuery } from "@tanstack/react-query";
import { resourcesApi } from "../infrastructure/api";
import { usePendingDeletionsStore } from "@/shared/lib/store/usePendingDeletionsStore";

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
  initialPrompts?: PromptArchetype[];
}

export const PromptsBrowser = ({ initialPrompts = [] }: PromptsBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = (params?.workspace as string) || "ws-product";

  const { draft, clearDraft } = useArchetypeDraft(workspaceId);
  const { pendingIds } = usePendingDeletionsStore();

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => [], // Fallback for now
  });

  const knowledgeHubsMap = React.useMemo(() => {
    return assets.reduce((acc, asset) => {
      acc[asset.id] = asset.title;
      return acc;
    }, {} as Record<string, string>);
  }, [assets]);

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
  const [promptToDeleteId, setPromptToDeleteId] = React.useState<string | null>(null);
  
  const [isInstructionsExpanded, setIsInstructionsExpanded] = React.useState(false);
  const [isConstraintsExpanded, setIsConstraintsExpanded] = React.useState(false);

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

  // Prepend draft to processed prompts and filter pending
  const displayPrompts = React.useMemo(() => {
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
  }, [draft, processedPrompts, pendingIds]);

  const activePrompt = React.useMemo(() => {
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
  }, [selectedPrompt, draft]);

  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search archetypes..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters}
            onRemove={handleRemoveFilter}
            onClearAll={handleClearAll}
          />
        )}
        topContent={
          <RecentlyUsedPrompts 
            prompts={recentlyUsedPrompts.filter(p => !pendingIds.has(p.id))} 
            onSelect={handleViewDetails} 
          />
        }
        actionBar={
          <ActionBar 
            filterGroups={filterGroups}
            activeFilters={activeFilters}
            quickFilters={QUICK_FILTERS}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(prompts)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        <PromptsBrowserContent 
            prompts={displayPrompts}
            viewMode={viewMode}
            onViewDetails={handleViewDetails}
            onDelete={handleDelete}
            isLoading={isLoading}
            isError={isError}
        />
      </BrowserLayout>

      {/* Prompt Details Sidebar */}
      <SidePeek 
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
        title={activePrompt?.archetype_name || "Archetype Details"}
        footer={
            <div className="flex w-full justify-between items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon-lg"
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
                    onClick={() => {
                        if (activePrompt?.id) {
                            handleDelete(activePrompt.id);
                            setIsSidebarOpen(false);
                        }
                    }}
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
                <Button 
                    className="bg-primary hover:bg-primary/90 font-bold" 
                    size="lg"
                    onClick={handleEdit}
                >
                    <Edit2 className="w-4 h-4 mr-2" /> {activePrompt?.isDraft ? "Kontynuuj projektowanie" : "Edytuj Archetyp"}
                </Button>
            </div>
        }
      >
        <div className="space-y-12">
            {/* ... Content remains same ... */}
        </div>
      </SidePeek>

      <DestructiveDeleteModal
        isOpen={!!promptToDeleteId}
        onClose={() => setPromptToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Archetype"
        resourceName={processedPrompts.find(p => p.id === promptToDeleteId)?.archetype_name || "this archetype"}
        affectedResources={[]}
      />
    </>
  );
};
