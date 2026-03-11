"use client";

import { useParams, useRouter } from "next/navigation";
import { useCrews, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { CrewsBrowser } from "@/modules/workspaces/features/browse-crews/ui/CrewsBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

export default function CrewsListPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;

  const { data: workspace } = useWorkspace(workspaceId);
  const { data: crews, isLoading } = useCrews(workspaceId);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const handleAssembleCrew = () => {
    // Nawigacja do nowo utworzonego Crew Studio
    router.push(`/workspaces/${workspaceId}/crews/studio`);
  };

  return (
    <PageLayout
      title="Crews"
      description={`Tactical units and multi-agent teams for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Crews" }
      ]}
      actions={
        <Button variant="primary" size="lg" onClick={handleAssembleCrew}>
          <Plus className="mr-2 h-4 w-4" /> Nowy Crew
        </Button>
      }
      showPagination={shouldShowPagination(crews?.length || 0)}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((index) => (
            <div key={index} className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <CrewsBrowser initialCrews={crews || []} colorName={colorName} />
      )}
    </PageLayout>
  );
}
