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
import { getAssets } from "@/modules/knowledge/features/browse-assets/infrastructure";

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

  const { data: assets = [] } = useQuery({
    queryKey: ["assets"],
    queryFn: async () => getAssets(),
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

  // Prepend draft to processed prompts
  const displayPrompts = React.useMemo(() => {
    if (!draft) return processedPrompts;
    
    const draftItem = {
      id: "draft",
      archetype_name: draft.name || "New Archetype",
      archetype_description: draft.description || "Resume design...",
      workspace_domain: "Draft",
      archetype_keywords: draft.keywords || [],
      archetype_role: draft.role || "",
      archetype_goal: draft.goal || "",
      archetype_backstory: draft.backstory || "",
      archetype_knowledge_hubs: draft.knowledgeHubIds || [],
      archetype_guardrails: {
          instructions: draft.instructions || [],
          constraints: draft.constraints || []
      },
      isDraft: true
    } as unknown as PromptArchetype & { isDraft?: boolean };
    
    return [draftItem, ...processedPrompts];
  }, [draft, processedPrompts]);

  const activePrompt = React.useMemo(() => {
    if (selectedPrompt?.id === "draft") {
        return {
            id: "draft",
            archetype_name: draft?.name || "New Archetype",
            archetype_description: draft?.description || "Resume design...",
            workspace_domain: "Draft",
            archetype_keywords: draft?.keywords || [],
            archetype_role: draft?.role || "",
            archetype_goal: draft?.goal || "",
            archetype_backstory: draft?.backstory || "",
            archetype_knowledge_hubs: draft?.knowledgeHubIds || [],
            archetype_guardrails: {
                instructions: draft?.instructions || [],
                constraints: draft?.constraints || []
            },
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
            prompts={recentlyUsedPrompts} 
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
            resultsCount={getPreviewCount(prompts) + (draft ? 1 : 0)}
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
            {/* ── Banner / Main Goal ── */}
            {activePrompt?.archetype_goal && (
                <div className="bg-muted/50 p-4 rounded-xl">
                    <p className="text-base leading-relaxed text-foreground/80 font-normal">
                        {activePrompt.archetype_goal}
                    </p>
                </div>
            )}

            {/* ── Keywords ── */}
            <section className="space-y-4">
                <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                    {activePrompt?.archetype_keywords?.map((kw: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-base font-normal">
                            #{kw}
                        </Badge>
                    ))}
                    {(!activePrompt?.archetype_keywords || activePrompt.archetype_keywords.length === 0) && (
                        <span className="text-base text-muted-foreground italic">Brak słów kluczowych</span>
                    )}
                </div>
            </section>

            {/* ── Knowledge Hubs ── */}
            <section className="space-y-4">
                <h4 className="text-base font-bold text-muted-foreground">Sugerowane Huby Wiedzy</h4>
                <div className="space-y-2">
                    {activePrompt?.archetype_knowledge_hubs?.map((hub: { id?: string; name?: string } | string, i: number) => {
                        const hubId = typeof hub === "string" ? hub : hub?.id;
                        const hubName = (typeof hub !== "string" ? hub?.name : null) || (hubId ? knowledgeHubsMap[hubId] : null) || hubId || "Nieznany Hub";
                        return (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-primary/5">
                                <BookOpen className="w-4 h-4 text-primary/60 shrink-0" />
                                <span className="text-base font-semibold text-foreground/90">{hubName}</span>
                            </div>
                        );
                    })}
                    {(!activePrompt?.archetype_knowledge_hubs || activePrompt.archetype_knowledge_hubs.length === 0) && (
                        <span className="text-base text-muted-foreground italic pl-1">Brak przypisanych hubów</span>
                    )}
                </div>
            </section>

            {/* ── Instructions ── */}
            {activePrompt?.archetype_guardrails?.instructions && activePrompt.archetype_guardrails.instructions.length > 0 && (
                <section className="space-y-4">
                    <h4 className="text-base font-bold text-muted-foreground">Zasady działania (Instructions)</h4>
                    <div className="space-y-2">
                        {(isInstructionsExpanded 
                            ? activePrompt.archetype_guardrails.instructions 
                            : activePrompt.archetype_guardrails.instructions.slice(0, 3)
                        ).map((inst: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-green-500/5 border border-green-500/10 dark:border-green-500/20">
                                <span className="text-base text-green-700 dark:text-green-400 leading-relaxed font-medium">{inst}</span>
                            </div>
                        ))}
                        
                        {!isInstructionsExpanded && activePrompt.archetype_guardrails.instructions.length > 3 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-green-600 hover:text-green-700 hover:bg-green-500/5 font-bold h-10 border border-dashed border-green-500/20"
                                onClick={() => setIsInstructionsExpanded(true)}
                            >
                                + {activePrompt.archetype_guardrails.instructions.length - 3} więcej
                            </Button>
                        )}
                        {isInstructionsExpanded && activePrompt.archetype_guardrails.instructions.length > 3 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-green-600 hover:text-green-700 hover:bg-green-500/5 font-bold h-10 border border-dashed border-green-500/20"
                                onClick={() => setIsInstructionsExpanded(false)}
                            >
                                Pokaż mniej
                            </Button>
                        )}
                    </div>
                </section>
            )}

            {/* ── Constraints ── */}
            {activePrompt?.archetype_guardrails?.constraints && activePrompt.archetype_guardrails.constraints.length > 0 && (
                <section className="space-y-4">
                    <h4 className="text-base font-bold text-muted-foreground">Ograniczenia (Constraints)</h4>
                    <div className="space-y-2">
                        {(isConstraintsExpanded 
                            ? activePrompt.archetype_guardrails.constraints 
                            : activePrompt.archetype_guardrails.constraints.slice(0, 3)
                        ).map((cons: string, i: number) => (
                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10 dark:border-red-500/20">
                                <span className="text-base text-red-700 dark:text-red-400 leading-relaxed font-medium">{cons}</span>
                            </div>
                        ))}

                        {!isConstraintsExpanded && activePrompt.archetype_guardrails.constraints.length > 3 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-500/5 font-bold h-10 border border-dashed border-red-500/20"
                                onClick={() => setIsConstraintsExpanded(true)}
                            >
                                + {activePrompt.archetype_guardrails.constraints.length - 3} więcej
                            </Button>
                        )}
                        {isConstraintsExpanded && activePrompt.archetype_guardrails.constraints.length > 3 && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-500/5 font-bold h-10 border border-dashed border-red-500/20"
                                onClick={() => setIsConstraintsExpanded(false)}
                            >
                                Pokaż mniej
                            </Button>
                        )}
                    </div>
                </section>
            )}

            {/* ── Availability ── */}
            <section className="space-y-4">
                <h4 className="text-base font-bold text-muted-foreground">Dostępność</h4>
                <div className="flex flex-wrap gap-1.5">
                    <Badge variant="outline" className="text-base font-normal">
                        {activePrompt?.workspace_domain === "global" ? "Global" : activePrompt?.workspace_domain || "Global"}
                    </Badge>
                </div>
            </section>
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
