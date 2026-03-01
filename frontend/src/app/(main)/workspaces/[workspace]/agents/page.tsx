"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAgents, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { ModulePageLayout } from "@/shared/ui/layout/ModulePageLayout";
import { Button } from "@/shared/ui/ui/Button";
import { Plus } from "lucide-react";
import { AgentModal } from "@/modules/workspaces/ui/modals/AgentModal";
import { AgentsBrowser } from "@/modules/workspaces/features/browse-agents/ui/AgentsBrowser";
import { Suspense } from "react";
import { shouldShowPagination } from "@/shared/lib/pagination";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";

export default function AgentsListPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: agents, isLoading } = useAgents(workspaceId);

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

  const openNewAgentModal = () => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set("modal", "new-agent");
    router.push(`?${urlSearchParams.toString()}`, { scroll: false });
  };

  return (
    <ModulePageLayout
      title="Agents"
      description={`Manage AI agents for ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Agents" }
      ]}
      actions={
        <Button variant="primary" size="lg" onClick={openNewAgentModal}>
          <Plus className="mr-2 h-4 w-4" /> Nowy Agent
        </Button>
      }
      showPagination={shouldShowPagination(agents?.length || 0)}
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
      
      <Suspense>
        <AgentModal />
      </Suspense>
    </ModulePageLayout>
  );
}
