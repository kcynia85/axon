"use client";

import { useParams } from "next/navigation";
import { useTemplates, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { TemplatesBrowser } from "@/modules/workspaces/features/browse-templates/ui/TemplatesBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";
import Link from "next/link";

export default function TemplatesListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: templates, isLoading } = useTemplates(workspaceId);

  return (
    <ModulePageLayout
      title="Templates"
      description={`Agent & Process templates for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Templates" }
      ]}
      actions={
        <Button variant="primary" size="lg" asChild>
          <Link href={`/workspaces/${workspaceId}/templates/new`}>
            <Plus className="mr-2 h-4 w-4" /> Nowy Template
          </Link>
        </Button>
      }
      showPagination={shouldShowPagination(templates?.length || 0)}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map(i => (
            <div key={i} className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <TemplatesBrowser initialTemplates={templates || []} />
      )}
    </ModulePageLayout>
  );
}
