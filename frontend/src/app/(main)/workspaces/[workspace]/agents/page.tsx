"use client";

import { useParams, useRouter } from "next/navigation";
import { useAgents, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { AgentsBrowser } from "@/modules/workspaces/features/browse-agents/ui/AgentsBrowser";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

export default function AgentsListPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: agents, isLoading } = useAgents(workspaceId);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const goToAgentStudio = () => {
    router.push(`/workspaces/${workspaceId}/agents/studio`);
  };

  return (
    <PageLayout
      title="Agents"
      description={`Manage AI agents for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Agents" }
      ]}
      actions={
        <ActionButton label="Nowy Agent" onClick={goToAgentStudio} />
      }
      showPagination={agents ? agents.length > 12 : false}
      pagination={null}
    >
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((index) => (
            <div key={index} className="h-48 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : (
        <AgentsBrowser initialAgents={agents || []} colorName={colorName} />
      )}
    </PageLayout>
  );
}
