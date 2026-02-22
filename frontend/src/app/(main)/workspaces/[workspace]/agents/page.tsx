"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useAgents, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Plus, Search, Filter, ArrowUpDown } from "lucide-react";
import { AgentModal } from "@/modules/workspaces/ui/modals/AgentModal";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Suspense } from "react";
import Link from "next/link";

/**
 * AgentsListPage - Dedicated list view for a workspace.
 * Based on Overview screen from axon_bb_workspace_agents.pdf
 */
export default function AgentsListPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: agents, isLoading } = useAgents(workspaceId);

  const openNewAgentModal = () => {
    const urlSearchParams = new URLSearchParams(searchParams.toString());
    urlSearchParams.set("modal", "new-agent");
    router.push(`?${urlSearchParams.toString()}`, { scroll: false });
  };

  return (
    <PageContainer>
      <PageHeader 
        title="Agents" 
        description={`Manage AI agents for ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Agents", active: true }
        ]}
      >
        <Button onClick={openNewAgentModal}>
          <Plus className="mr-2 h-4 w-4" /> Nowy Agent
        </Button>
      </PageHeader>

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search agents..." className="pl-10" />
            </div>
            <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
                <ArrowUpDown className="h-4 w-4" />
            </Button>
        </div>

        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-48 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents?.map((agent) => (
                    <Link key={agent.id} href={`/workspaces/${workspaceId}/agents/${agent.id}`}>
                        <Card className="group hover:border-primary/50 transition-colors cursor-pointer h-full">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{agent.role}</CardTitle>
                                    <Badge variant="secondary">Active</Badge>
                                </div>
                                <CardDescription className="line-clamp-3 mt-2 min-h-[4.5rem]">
                                    {agent.goal}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between border-t pt-4">
                                <div className="text-[10px] text-muted-foreground">
                                    Keywords: {agent.keywords?.slice(0, 2).join(", ")}...
                                </div>
                                <Button variant="ghost" size="sm" className="h-8">Details</Button>
                            </CardFooter>
                        </Card>
                    </Link>
                ))}
            </div>
        )}

        <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
            Pagination: Agents (Placeholder)
        </div>
      </PageContent>
      
      <Suspense>
        <AgentModal />
      </Suspense>
    </PageContainer>
  );
}
