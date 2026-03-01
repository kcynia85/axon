"use client";

import { useParams } from "next/navigation";
import { useCrews, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { CrewsBrowser } from "@/modules/workspaces/features/browse-crews/ui/CrewsBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";
import Link from "next/link";

export default function CrewsListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: crews, isLoading } = useCrews(workspaceId);

  return (
    <ModulePageLayout
      title="Crews"
      description={`Manage agent teams for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Crews" }
      ]}
      actions={
        <Button variant="primary" size="lg" asChild>
          <Link href={`/workspaces/${workspaceId}/crews/new`}>
            <Plus className="mr-2 h-4 w-4" /> Nowy Crew
          </Link>
        </Button>
      }
      showPagination={shouldShowPagination(crews?.length || 0)}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-48 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <CrewsBrowser initialCrews={crews || []} />
      )}
    </ModulePageLayout>
  );
}
