"use client";

import React from "react";
import { WorkspacesList } from "@/modules/workspaces/ui/WorkspacesList";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";

export default function WorkspacesPage() {
  return (
    <PageLayout
        title="Workspaces"
        description="Manage your AI agents and crews in isolated environments."
        breadcrumbs={[
            { label: "Home", href: "/home" },
            { label: "Workspaces" }
        ]}
        pagination={null}
        showPagination={false} // Pagination is now handled inside WorkspacesList via infinite scroll
    >
        <BrowserLayout>
            <WorkspacesList viewMode="grid" />
        </BrowserLayout>
    </PageLayout>
  );
}
