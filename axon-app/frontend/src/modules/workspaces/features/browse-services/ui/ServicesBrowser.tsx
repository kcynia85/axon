"use client";

import React from "react";
import { FilterBar } from "@/shared/ui/complex/FilterBar";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { useServicesBrowser } from "../application/useServicesBrowser";
import { ExternalService as Service } from "@/shared/domain/resources";
import { Cloud } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SortOption } from "@/shared/domain/filters";
import { ActionBar } from "@/shared/ui/complex/ActionBar";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { useDeleteService } from "@/modules/workspaces/application/useServices";
import { useServiceDraft } from "@/modules/studio/features/service-studio/application/hooks/useServiceDraft";
import { ServiceProfilePeek } from "@/modules/workspaces/ui/ServiceProfilePeek";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { toast } from "sonner";
import { BrowserEmptyState } from "@/shared/ui/complex/BrowserEmptyState";

const SORT_OPTIONS: readonly SortOption[] = [
  { id: "name-asc", label: "Name (A-Z)" },
  { id: "name-desc", label: "Name (Z-A)" },
  { id: "newest", label: "Recently Added" },
];

type ServicesBrowserProps = {
  readonly initialServices: Service[];
  readonly colorName?: string;
}

export const ServicesBrowser = ({ initialServices, colorName = "default" }: ServicesBrowserProps) => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const {
    processedServices,
    viewMode,
    setViewMode,
    selectedServiceId,
    isSidebarOpen,
    setIsSidebarOpen,
    handleViewDetails,
    filterConfig,
  } = useServicesBrowser(initialServices);

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

  const { mutate: deleteService } = useDeleteService(workspaceId);
  const { draft, clearDraft } = useServiceDraft(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [serviceToDeleteId, setServiceToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic usługi usunięty");
      }
      return;
    }
    
    const service = initialServices.find(s => s.id === id);
    const name = service?.service_name || "Service";
    deleteWithUndo(id, name, () => deleteService(id));
  };

  const confirmDelete = () => {
    if (serviceToDeleteId) {
      deleteService(serviceToDeleteId);
      setServiceToDeleteId(null);
      toast.success("Usługa usunięta");
    }
  };

  const selectedService = initialServices.find(s => s.id === selectedServiceId) || null;

  // Map draft to Service structure for peek
  const draftService = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      service_name: draft.name || "New Service",
      service_description: draft.business_context || "Work in progress...",
      service_category: draft.categories?.[0] || "Business",
      service_url: draft.url || "",
      service_keywords: draft.keywords || [],
      capabilities: draft.capabilities?.map((c: any) => ({
          capability_name: c.name,
          capability_description: c.description
      })) || [],
      availability_workspace: [workspaceId],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const activeService = isDraftSelected ? draftService : selectedService;

  const handleEdit = (id: string) => {
    router.push(`/workspaces/${workspaceId}/services/studio/${id}`);
  };

  return (
    <>
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search services..."
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
            quickFilters={[
              { label: "Kategorie", groupId: 'categories' }
            ]}
            onToggleFilter={handleToggleFilter}
            onApplyFilters={handleApplyFilters}
            onClearAllFilters={handleClearAll}
            onPendingFilterIdsChange={setPendingFilterIds}
            resultsCount={getPreviewCount(initialServices) + (draft ? 1 : 0)}
            sortOptions={SORT_OPTIONS}
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        }
      >
        {processedServices.length === 0 && !draft ? (
          <BrowserEmptyState
            message={initialServices.length === 0 ? "No services found. Add an integration." : "No services found matching your criteria."}
          />
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-8"}>
            {/* Render Draft if exists and matches search */}
            {draft && (!searchQuery || draft.name?.toLowerCase().includes(searchQuery.toLowerCase())) && (
              <WorkspaceCardHorizontal 
                  key="service-draft"
                  isDraft
                  icon={Cloud}
                  title={draft.name || "New Service"}
                  description={draft.business_context || "Resume integration..."}
                  href="#"
                  badgeLabel={draft.categories?.[0] || "Draft Service"}
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

            {processedServices.map((service) => (
              <WorkspaceCardHorizontal 
                  key={service.id}
                  title={service.service_name}
                  description={service.service_description || `Integration with ${service.service_category} platform.`}
                  href="#"
                  badgeLabel={service.service_category}
                  tags={service.service_keywords}
                  colorName={colorName}
                  resourceId={service.id}
                  onEdit={() => {
                      setIsDraftSelected(false);
                      handleEdit(service.id);
                  }}
                  onClick={() => {
                      setIsDraftSelected(false);
                      handleViewDetails(service.id);
                  }}
                  onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <ServiceProfilePeek 
          service={activeService}
          isOpen={isSidebarOpen}
          onClose={() => {
              setIsDraftSelected(false);
              setIsSidebarOpen(false);
          }}
          onDelete={handleDelete}
          onEdit={(id) => {
            if (isDraftSelected) {
              router.push(`/workspaces/${workspaceId}/services/studio`);
            } else {
              handleEdit(id);
            }
          }}
        />
      </BrowserLayout>

      <DestructiveDeleteModal
        isOpen={!!serviceToDeleteId}
        onClose={() => setServiceToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Service"
        resourceName={initialServices.find(s => s.id === serviceToDeleteId)?.service_name || "this service"}
        affectedResources={[]}
      />
    </>
  );
};
