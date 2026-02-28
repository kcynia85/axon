"use client";

import { WorkspacesList } from "@/modules/workspaces/ui/WorkspacesList";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { useWorkspaces } from "@/modules/workspaces/application/useWorkspaces";
import { shouldShowPagination } from "@/shared/lib/pagination";

export default function WorkspacesPage() {
  const { data: workspaces } = useWorkspaces();
  const showPagination = workspaces ? shouldShowPagination(workspaces.length) : false;

  return (
    <ModulePageLayout
        title="Workspaces"
        description="Manage your AI agents and crews in isolated environments."
        breadcrumbs={[
            { label: "Dashboard", href: "/dashboard" },
            { label: "Workspaces" }
        ]}
        pagination={null}
        showPagination={showPagination}
    >
        <WorkspacesList />
    </ModulePageLayout>
  );
}
