"use client";

import { useParams, useRouter } from "next/navigation";
import { useCrews, useWorkspace } from "@/modules/workspaces/application/use-workspaces";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Button } from "@/shared/ui/ui/button";
import { Input } from "@/shared/ui/ui/input";
import { Plus, Search, Filter, ArrowUpDown, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import Link from "next/link";

/**
 * CrewsListPage - Dedicated list view for a workspace.
 * Based on Overview screen from axon_bb_workspace_crews.pdf
 */
export default function CrewsListPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: crews, isLoading } = useCrews(workspaceId);

  return (
    <PageContainer>
      <PageHeader 
        title="Crews" 
        description={`Manage agent teams for ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Crews", active: true }
        ]}
      >
        <Button asChild>
          <Link href={`/workspaces/${workspaceId}/crews/new`}>
            <Plus className="mr-2 h-4 w-4" /> Nowy Crew
          </Link>
        </Button>
      </PageHeader>

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search crews..." className="pl-10" />
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
                {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {crews?.map((crew) => (
                    <Card key={crew.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{crew.name}</CardTitle>
                                </div>
                                <Badge variant="outline" className="capitalize">{crew.process}</Badge>
                            </div>
                            <CardDescription className="mt-2">
                                {crew.agents.length} Agents involved in this crew.
                            </CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between border-t pt-4">
                             <div className="text-[10px] text-muted-foreground">
                                Cost: $0.00 (Example)
                            </div>
                            <Button variant="ghost" size="sm" asChild className="h-8">
                                <Link href={`/workspaces/${workspaceId}/crews/${crew.id}/edit`}>Edit</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
            Pagination: Crews (Placeholder)
        </div>
      </PageContent>
    </PageContainer>
  );
}
