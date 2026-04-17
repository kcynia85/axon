"use client";

import { useParams, useRouter } from "next/navigation";
import { useAutomations, useDeleteAutomation } from "@/modules/workspaces/application/useAutomations";
import { useAutomationDraft } from "@/modules/studio/features/automation-studio/application/useAutomationDraft";
import { useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Plus, Zap } from "lucide-react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { useState, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { AutomationSidePeekContent } from "@/modules/workspaces/ui/AutomationSidePeek";
import { ActionBar, QuickFilter } from "@/shared/ui/complex/ActionBar";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { SortOption } from "@/shared/domain/filters";
import { useResourceFilters } from "@/shared/lib/hooks/useResourceFilters";
import { Automation } from "@/shared/domain/workspaces";
import { BrowserEmptyState } from "@/shared/ui/complex/BrowserEmptyState";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "date-desc", label: "Newest first" },
  { id: "date-asc", label: "Oldest first" },
];

const QUICK_FILTERS: readonly QuickFilter[] = [
  { label: "By Platform", groupId: "platform" },
  { label: "By Status", groupId: "status" },
];

/**
 * AutomationsListPage: Lists all automation definitions.
 * Standard: 0% useEffect, arrow function.
 */
const AutomationsListPage = () => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const { draft, clearDraft } = useAutomationDraft(workspaceId);
  const { mutate: deleteAutomation } = useDeleteAutomation(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  
  const [automationToDeleteId, setAutomationToDeleteId] = useState<string | null>(null);
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  // --- Filtering Logic ---
  const filterItems = useCallback((items: readonly Automation[], query: string, filterIds: string[]) => {
    return items.filter(item => {
        const matchesQuery = 
            item.automation_name.toLowerCase().includes(query.toLowerCase()) ||
            item.automation_platform.toLowerCase().includes(query.toLowerCase());

        if (!matchesQuery) return false;
        if (filterIds.length === 0) return true;

        const statusFilters = filterIds.filter(id => ["Active", "Draft", "Paused"].includes(id));
        const platformFilters = filterIds.filter(id => ["n8n", "Zapier", "Make", "Custom"].includes(id));

        const matchesStatus = statusFilters.length === 0 || statusFilters.includes(item.automation_status);
        const matchesPlatform = platformFilters.length === 0 || platformFilters.includes(item.automation_platform);

        return matchesStatus && matchesPlatform;
    });
  }, []);

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
    getFilteredItems,
    getPreviewCount,
    setPendingFilterIds,
  } = useResourceFilters<Automation>({
    filterItems,
    initialSortBy: "date-desc",
    initialFilterGroups: [
        {
            id: "status",
            title: "Status:",
            type: "checkbox",
            options: [
                { id: "Active", label: "Active", isChecked: false },
                { id: "Draft", label: "Draft", isChecked: false },
                { id: "Paused", label: "Paused", isChecked: false },
            ]
        },
        {
            id: "platform",
            title: "Platform:",
            type: "checkbox",
            options: [
                { id: "n8n", label: "n8n", isChecked: false },
                { id: "Zapier", label: "Zapier", isChecked: false },
                { id: "Make", label: "Make", isChecked: false },
                { id: "Custom", label: "Custom", isChecked: false },
            ]
        }
    ]
  });

  const processedAutomations = useMemo(() => {
    if (!automations) return [];
    const result = getFilteredItems(automations);

    result.sort((a, b) => {
        if (sortBy === "name-asc") return a.automation_name.localeCompare(b.automation_name);
        if (sortBy === "name-desc") return b.automation_name.localeCompare(a.automation_name);
        
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortBy === "date-desc" ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [automations, getFilteredItems, sortBy]);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic automatyzacji usunięty");
      }
      return;
    }

    const automation = automations?.find(a => a.id === id);
    if (automation) {
      deleteWithUndo(id, automation.automation_name, () => deleteAutomation(id));
    }
  };

  const confirmDelete = () => {
    if (automationToDeleteId) {
      deleteAutomation(automationToDeleteId);
      setAutomationToDeleteId(null);
      toast.success("Automatyzacja usunięta");
    }
  };

  const goToAutomationStudio = () => {
    router.push(`/workspaces/${workspaceId}/automations/studio`);
  };

  const selectedAutomation = useMemo(() => 
    automations?.find((a) => a.id === selectedAutomationId), 
    [automations, selectedAutomationId]
  );

  const handleEdit = (id: string) => {
    router.push(`/workspaces/${workspaceId}/automations/studio/${id}`);
  };

  return (
    <>
      <PageLayout
        title="Automations"
        description={`Workflow triggers and scheduled tasks in ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Automations" }
        ]}
        actions={
          <ActionButton 
              label="Nowa Automatyzacja" 
              icon={Plus}
              onClick={goToAutomationStudio} 
          />
        }
        showPagination={false}
      >
        <BrowserLayout
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search automations..."
          activeFilters={activeFilters.length > 0 && (
            <FilterBar 
              activeFilters={activeFilters}
              onRemove={handleRemoveFilter}
              onClearAll={handleClearAll}
            />
          )}
          actionBar={
            <ActionBar 
              filterGroups={filterGroups}
              activeFilters={activeFilters}
              quickFilters={QUICK_FILTERS}
              onToggleFilter={handleToggleFilter}
              onApplyFilters={handleApplyFilters}
              onClearAllFilters={handleClearAll}
              onPendingFilterIdsChange={setPendingFilterIds}
              resultsCount={getPreviewCount(automations || [])}
              sortOptions={SORT_OPTIONS}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          }
        >
          {isLoading ? (
              <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4" : "flex flex-col gap-4 pt-4"}>
                  {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl shadow-sm" />)}
              </div>
          ) : processedAutomations.length === 0 && !draft ? (
              <BrowserEmptyState
                message={automations?.length === 0 ? "No automations active. Set some triggers." : "No automations found matching your criteria."}
              />
          ) : (
              <div className={viewMode === "grid" ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4" : "flex flex-col gap-4 pt-4"}>
                  {/* Draft Card */}
                  {draft && !searchQuery && (
                      <WorkspaceCardHorizontal 
                          key="automation-draft"
                          isDraft
                          title={draft.definition?.name || "New Automation"}
                          description={draft.definition?.semanticDescription || "Resume designing logic..."}
                          href="#"
                          icon={Zap}
                          resourceId="draft"
                          onEdit={() => router.push(`/workspaces/${workspaceId}/automations/studio`)}
                          onClick={() => router.push(`/workspaces/${workspaceId}/automations/studio`)}
                          onDelete={() => handleDelete("draft")}
                          colorName="default"
                      />
                  )}

                  {processedAutomations.map((automation) => (
                      <WorkspaceCardHorizontal 
                          key={automation.id}
                          title={automation.automation_name}
                          description={automation.automation_description || `${automation.automation_platform} Integration`}
                          href="#"
                          badgeLabel={automation.automation_status}
                          icon={Zap}
                          resourceId={automation.id}
                          onEdit={() => handleEdit(automation.id)}
                          onClick={() => setSelectedAutomationId(automation.id)}
                          onDelete={handleDelete}
                          colorName={colorName}
                      />
                  ))}
              </div>
          )}
        </BrowserLayout>
      </PageLayout>

      {selectedAutomationId && (
          <AutomationSidePeekContent 
              workspaceId={workspaceId} 
              automationId={selectedAutomationId}
              automation={selectedAutomation} 
              onClose={() => setSelectedAutomationId(null)}
          />
      )}

      <DestructiveDeleteModal
        isOpen={!!automationToDeleteId}
        onClose={() => setAutomationToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Automation"
        resourceName={automations?.find(a => a.id === automationToDeleteId)?.automation_name || "this automation"}
        affectedResources={[]}
      />
    </>
  );
};

export default AutomationsListPage;
