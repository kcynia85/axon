"use client";

import { useParams } from "next/navigation";
import { usePatterns, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { PatternsBrowser } from "@/modules/workspaces/features/browse-patterns/ui/PatternsBrowser";
import { shouldShowPagination } from "@/shared/lib/pagination";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

export default function PatternsListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: patterns, isLoading } = usePatterns(workspaceId);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  return (
    <ModulePageLayout
      title="Patterns"
      description={`Behavior & Workflow patterns for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Patterns" }
      ]}
      showPagination={shouldShowPagination(patterns?.length || 0)}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2].map((index) => (
            <div key={index} className="h-32 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <PatternsBrowser initialPatterns={patterns || []} colorName={colorName} />
      )}
    </ModulePageLayout>
  );
}
