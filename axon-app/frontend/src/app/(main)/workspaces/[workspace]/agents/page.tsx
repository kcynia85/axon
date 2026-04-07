import React from "react";
import Link from "next/link";
import { workspacesApi } from "@/modules/workspaces/infrastructure/api";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { AgentsBrowser } from "@/modules/agents/features/browse-agents/ui/AgentsBrowser";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

type AgentsListPageProps = {
  readonly params: Promise<{ workspace: string }>;
};

export default async function AgentsListPage({ params }: AgentsListPageProps) {
  const { workspace: workspaceId } = await params;
  
  // Fetch initial data on the server
  const [workspace, agents] = await Promise.all([
    workspacesApi.getWorkspace(workspaceId),
    workspacesApi.getAgents(workspaceId)
  ]);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

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
        <ActionButton label="Nowy Agent" asChild>
           <Link href={`/workspaces/${workspaceId}/agents/studio`} />
        </ActionButton>
      }
      showPagination={agents ? agents.length > 12 : false}
      pagination={null}
    >
      <AgentsBrowser initialAgents={agents || []} colorName={colorName} />
    </PageLayout>
  );
}
