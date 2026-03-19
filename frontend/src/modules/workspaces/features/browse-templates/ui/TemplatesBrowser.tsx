"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useTemplatesBrowser } from "../application/useTemplatesBrowser";
import { Template } from "@/shared/domain/workspaces";
import { FileText } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteTemplate } from "@/modules/workspaces/application/useTemplates";
import { useTemplateDraft } from "@/modules/studio/features/template-studio/application/hooks/useTemplateDraft";
import { TemplateProfilePeek } from "@/modules/workspaces/ui/TemplateProfilePeek";
import { toast } from "sonner";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Newest first" },
];

type TemplatesBrowserProps = {
  readonly initialTemplates: Template[];
  readonly colorName?: string;
}

export const TemplatesBrowser = ({ initialTemplates, colorName = "default" }: TemplatesBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedTemplates,
    viewMode,
    setViewMode,
    selectedTemplateId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  } = useTemplatesBrowser(initialTemplates);

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

  const { mutateAsync: deleteTemplateAsync } = useDeleteTemplate();
  const { deleteWithUndo } = useDeleteWithUndo();
  const { draft, clearDraft } = useTemplateDraft(workspaceId);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (id === "draft") {
        if (window.confirm("Are you sure you want to discard this draft?")) {
            clearDraft();
            setIsDraftSelected(false);
            setIsSidebarOpen(false);
            toast.success("Szkic usunięty");
        }
        return;
    }
    
    const template = initialTemplates.find(t => t.id === id);
    const name = template?.template_name || "Template";
    deleteWithUndo(id, name, () => deleteTemplateAsync({ workspaceId, id }));
  };

  const confirmDelete = async () => {
    if (templateToDeleteId) {
      try {
        await deleteTemplateAsync({ workspaceId, id: templateToDeleteId });
        setTemplateToDeleteId(null);
        setIsSidebarOpen(false);
        toast.success("Szablon usunięty");
      } catch (error) {
        toast.error("Błąd podczas usuwania szablonu");
      }
    }
  };

  // Wrapper for Card (needs confirm)
  const handleDeleteWithConfirm = async (id: string) => {
      await handleDelete(id);
  };

  const selectedTemplate = initialTemplates.find(t => t.id === selectedTemplateId) || null;

  // Map draft to Template structure for peek
  const draftTemplate = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      template_name: draft.name || "New Template",
      template_description: draft.description || "Work in progress...",
      template_markdown_content: draft.markdown || "",
      template_keywords: draft.keywords || [],
      template_inputs: draft.context_items?.map(i => ({
          id: (i as any).id || "draft-in",
          label: i.name,
          expectedType: i.field_type,
          isRequired: i.is_required
      })) || [],
      template_outputs: draft.artefact_items?.map(o => ({
          id: (o as any).id || "draft-out",
          label: o.name,
          outputType: o.field_type,
          isRequired: o.is_required
      })) || [],
      template_checklist_items: [],
      availability_workspace: draft.availability_workspace || [workspaceId],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const activeTemplate = isDraftSelected ? draftTemplate : selectedTemplate;

  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search templates..."
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
            quickFilters={[]}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(initialTemplates) + (draft ? 1 : 0)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        {processedTemplates.length === 0 && !draft ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground italic">No templates found matching your criteria.</p>
          </div>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
            {/* Render Draft if exists and matches search */}
            {draft && (!searchQuery || draft.name?.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <WorkspaceCardHorizontal 
                  key="template-draft"
                  isDraft
                  icon={FileText}
                  title={draft.name || "New Template"}
                  description={draft.description || "Resume creating this template..."}
                  href={`/workspaces/${workspaceId}/templates/studio`}
                  badgeLabel="Draft"
                  tags={draft.keywords}
                  colorName="default"
                  resourceId="draft"
                  onEdit={() => {
                      setIsDraftSelected(true);
                      setIsSidebarOpen(true);
                  }}
                  onClick={() => {
                      setIsDraftSelected(true);
                      setIsSidebarOpen(true);
                  }}
                  onDelete={() => handleDelete("draft")}
              />
            )}

            {processedTemplates.map((template) => (
              <WorkspaceCardHorizontal 
                  key={template.id}
                  title={template.template_name}
                  description={template.template_description}
                  href={`/workspaces/${workspaceId}/templates/${template.id}`}
                  badgeLabel="Structure"
                  tags={template.template_keywords}
                  colorName={colorName}
                  icon={FileText}
                  resourceId={template.id}
                  onEdit={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(template.id);
                  }}
                  onClick={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(template.id);
                  }}
                  onDelete={handleDeleteWithConfirm}
              />
            ))}
          </div>
        )}

        <TemplateProfilePeek 
          template={activeTemplate}
          isOpen={isSidebarOpen}
          onClose={() => {
              setIsDraftSelected(false);
              setIsSidebarOpen(false);
          }}
          onDelete={handleDelete}
          onEdit={() => {
            if (isDraftSelected) {
              router.push(`/workspaces/${workspaceId}/templates/studio`);
            } else if (selectedTemplateId) {
              router.push(`/workspaces/${workspaceId}/templates/studio/${selectedTemplateId}`);
            }
          }}
        />
      </BrowserLayout>

      <DestructiveDeleteModal
        isOpen={!!templateToDeleteId}
        onClose={() => setTemplateToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Template"
        resourceName={initialTemplates.find(t => t.id === templateToDeleteId)?.template_name || "this template"}
        affectedResources={[]}
      />
    </>
  );
};
