'use client';

import React from "react";
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
import { Sparkles, Clock, Globe, ShieldCheck, Tag, Edit2 } from "lucide-react";
import { useDeletePromptArchetype } from "../application/usePromptArchetypes";
import { useArchetypeDraft } from "@/modules/studio/features/archetypes/application/useArchetypeDraft";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/shared/ui/ui/Button";
import { toast } from "sonner";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "Product", groupId: "domain" },
  { label: "Marketing", groupId: "domain" },
];

interface PromptsBrowserProps {
  initialPrompts?: PromptArchetype[];
}

export const PromptsBrowser = ({ initialPrompts = [] }: PromptsBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = (params?.workspace as string) || "ws-product";

  const { draft, clearDraft } = useArchetypeDraft(workspaceId);

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
    filterConfig
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
  } = filterConfig;

  const { mutate: deletePrompt } = useDeletePromptArchetype();
  const [promptToDeleteId, setPromptToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic archetypu usunięty");
      }
      return;
    }

    setPromptToDeleteId(id);
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
    
    const draftItem: any = {
      id: "draft",
      archetype_name: draft.name || "New Archetype",
      archetype_description: draft.description || "Resume design...",
      workspace_domain: "Draft",
      archetype_keywords: draft.keywords || [],
      isDraft: true
    };
    
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
            isDraft: true
        } as any;
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
        title={activePrompt?.archetype_name || "Archetype Details"}
        open={isSidebarOpen} 
        onOpenChange={setIsSidebarOpen}
      >
        {activePrompt && (
            <div className="p-8 space-y-8">
                <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                        <Badge variant={activePrompt.isDraft ? "default" : "outline"} className={`px-3 py-1 font-mono text-[10px] tracking-widest uppercase ${activePrompt.isDraft ? "bg-amber-500/20 text-amber-600" : "bg-primary/5 text-primary border-primary/20"}`}>
                            {activePrompt.workspace_domain}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            <Clock className="w-3 h-3" /> {activePrompt.isDraft ? "Currently working" : "Updated 1d ago"}
                        </div>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">{activePrompt.archetype_name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {activePrompt.archetype_description || "No description provided for this archetype."}
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-muted/30 p-4 rounded-xl border border-primary/5 space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="w-3 h-3" /> Security & Policy
                        </h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Data Privacy</span>
                            <Badge variant="default" className="bg-green-500/20 text-green-600 hover:bg-green-500/30 border-none">Secure</Badge>
                        </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-xl border border-primary/5 space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                            <Tag className="w-3 h-3" /> Capabilities
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {activePrompt.archetype_keywords?.map((kw: string, i: number) => (
                                <Badge key={i} variant="secondary" className="bg-background text-zinc-400 border-none px-3 py-1 text-[10px] font-bold lowercase">
                                    #{kw}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-muted">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">System Prompt Blueprint</h4>
                    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 font-mono text-[11px] leading-relaxed text-zinc-400 overflow-x-auto">
                        <pre>{`You are an AI-native agent specializing in ${activePrompt.archetype_name}. 
Your goal is to ${activePrompt.archetype_description}. 

Strictly follow these domain guidelines:
- Maintain ${activePrompt.workspace_domain} context at all times.
- Prioritize high-signal output.
- Avoid redundant reasoning.`}</pre>
                    </div>
                </div>

                <div className="flex gap-3 mt-6">
                    <Button 
                        variant="outline"
                        onClick={() => {
                            if (activePrompt?.id) {
                                handleDelete(activePrompt.id);
                                setIsSidebarOpen(false);
                            }
                        }}
                        className="flex-1 py-6 text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-500/20 rounded-2xl font-black uppercase tracking-widest transition-all"
                    >
                        Usuń
                    </Button>
                    <Button 
                        onClick={handleEdit}
                        className="flex-[2] py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all gap-3"
                    >
                        <Edit2 className="w-5 h-5" /> {activePrompt.isDraft ? "Kontynuuj projektowanie" : "Edytuj Archetyp"}
                    </Button>
                </div>
            </div>
        )}
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
