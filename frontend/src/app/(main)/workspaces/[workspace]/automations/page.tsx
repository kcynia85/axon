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
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { AutomationSidePeekContent } from "@/modules/workspaces/ui/AutomationSidePeekContent";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [automationToDeleteId, setAutomationToDeleteId] = useState<string | null>(null);
  const [selectedAutomationId, setSelectedAutomationId] = useState<string | null>(null);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const filteredAutomations = automations?.filter(automation => 
    automation.automation_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    automation.automation_platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        >
          {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                  {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl shadow-sm" />)}
              </div>
          ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
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

                  {filteredAutomations?.map((automation) => (
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
