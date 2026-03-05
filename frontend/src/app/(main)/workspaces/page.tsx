"use client";

import React from "react";
import { WorkspacesList } from "@/modules/workspaces/ui/WorkspacesList";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { useWorkspaces } from "@/modules/workspaces/application/useWorkspaces";
import { shouldShowPagination } from "@/shared/lib/pagination";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";

export default function WorkspacesPage() {
  const { data: workspaces, isLoading, isError } = useWorkspaces();

  const showPagination = workspaces ? shouldShowPagination(workspaces.length) : false;

  return (
    <PageLayout
        title="Workspaces"
        description="Manage your AI agents and crews in isolated environments."
        breadcrumbs={[
            { label: "Home", href: "/home" },
            { label: "Workspaces" }
        ]}
        pagination={null}
        showPagination={showPagination}
    >
        <BrowserLayout>
            <WorkspacesList 
                workspaces={workspaces || []} 
                isLoading={isLoading} 
                isError={isError} 
                viewMode="grid"
            />
        </BrowserLayout>
    </PageLayout>
  );
}
