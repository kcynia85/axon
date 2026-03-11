"use client";

import { useParams, useRouter } from "next/navigation";
import { useTemplates, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { TemplatesBrowser } from "@/modules/workspaces/features/browse-templates/ui/TemplatesBrowser";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

/**
 * TemplatesListPage: Displays all standardized document structures for a workspace.
 */
export default function TemplatesListPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: templates, isLoading } = useTemplates(workspaceId);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const handleCreateTemplate = () => {
    router.push(`/workspaces/${workspaceId}/templates/studio`);
  };

  const shouldShowPagination = (count: number) => count > 12;

  return (
    <PageLayout
      title="Templates"
      description={`Standardized document structures for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Templates" }
      ]}
      actions={
        <ActionButton label="Create Template" onClick={handleCreateTemplate} />
      }
      showPagination={shouldShowPagination(templates?.length || 0)}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <TemplatesBrowser initialTemplates={templates || []} colorName={colorName} />
      )}
    </PageLayout>
  );
}
