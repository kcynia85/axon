import React from "react";
import { Edit2, Trash2 } from "lucide-react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { PromptsBrowserContent } from "./components/PromptsBrowserContent";
import { RecentlyUsedPrompts } from "./components/RecentlyUsedPrompts";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { Button } from "@/shared/ui/ui/Button";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { PromptsBrowserViewProps } from "./PromptsBrowserView.types";

export const PromptsBrowserView = ({
  prompts,
  displayPrompts,
  recentlyUsedPrompts,
  viewMode,
  setViewMode,
  isLoading,
  isError,
  isSidebarOpen,
  onSidebarOpenChange,
  activePrompt,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  sortOptions,
  activeFilters,
  filterGroups,
  quickFilters,
  onToggleFilter,
  onRemoveFilter,
  onClearAllFilters,
  onApplyFilters,
  onPendingFilterIdsChange,
  onEdit,
  onDelete,
  onViewDetails,
  previewCount,
  promptToDeleteId,
  onConfirmDelete,
  onCancelDelete,
  promptToDeleteName,
}: PromptsBrowserViewProps) => {
  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        searchPlaceholder="Search archetypes..."
        activeFilters={activeFilters.length > 0 && (
          <FilterBar 
            activeFilters={activeFilters as any}
            onRemove={onRemoveFilter as any}
            onClearAll={onClearAllFilters}
          />
        )}
        topContent={
          <RecentlyUsedPrompts 
            prompts={recentlyUsedPrompts as any} 
            onSelect={onViewDetails} 
          />
        }
        actionBar={
          <ActionBar 
            filterGroups={filterGroups as any}
            activeFilters={activeFilters as any}
            quickFilters={quickFilters as any}
            onToggleFilter={onToggleFilter}
            onApplyFilters={onApplyFilters}
            onClearAllFilters={onClearAllFilters}
            onPendingFilterIdsChange={onPendingFilterIdsChange}
            resultsCount={previewCount}
            sortOptions={sortOptions as any}
            sortBy={sortBy}
            onSortChange={onSortChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        <PromptsBrowserContent 
            prompts={displayPrompts as any}
            viewMode={viewMode}
            onViewDetails={onViewDetails}
            onDelete={onDelete}
            isLoading={isLoading}
            isError={isError}
        />
      </BrowserLayout>

      {/* Prompt Details Sidebar */}
      <SidePeek 
        open={isSidebarOpen} 
        onOpenChange={onSidebarOpenChange}
        title={activePrompt?.archetype_name || "Archetype Details"}
        footer={
            <div className="flex w-full justify-between items-center gap-4">
                <Button 
                    variant="ghost" 
                    size="icon-lg"
                    className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
                    onClick={() => {
                        if (activePrompt?.id) {
                            onDelete(activePrompt.id);
                            onSidebarOpenChange(false);
                        }
                    }}
                >
                    <Trash2 className="w-5 h-5" />
                </Button>
                <Button 
                    className="bg-primary hover:bg-primary/90 font-bold" 
                    size="lg"
                    onClick={onEdit}
                >
                    <Edit2 className="w-4 h-4 mr-2" /> {activePrompt?.isDraft ? "Kontynuuj projektowanie" : "Edytuj Archetyp"}
                </Button>
            </div>
        }
      >
        <div className="space-y-12">
            {/* ── Content area for activePrompt details ── */}
            {activePrompt?.archetype_description && (
                <div className="bg-muted/50 p-4 rounded-xl">
                    <p className="text-base leading-relaxed text-foreground/80 font-normal">
                        {activePrompt.archetype_description}
                    </p>
                </div>
            )}
            {/* Additional details like instructions, constraints, etc. could be added here */}
        </div>
      </SidePeek>

      <DestructiveDeleteModal
        isOpen={!!promptToDeleteId}
        onClose={onCancelDelete}
        onConfirm={onConfirmDelete}
        title="Delete Archetype"
        resourceName={promptToDeleteName || "this archetype"}
        affectedResources={[]}
      />
    </>
  );
};
