"use client";

import { useParams } from "next/navigation";
import { useAutomations, useWorkspace } from "@/modules/workspaces/application/use-workspaces";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Input } from "@/shared/ui/ui/input";
import { Search, Zap, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Skeleton } from "@/shared/ui/ui/skeleton";

/**
 * AutomationsListPage - Dedicated list view for a workspace (Read-only).
 */
export default function AutomationsListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: automations, isLoading } = useAutomations(workspaceId);

  return (
    <PageContainer>
      <PageHeader 
        title="Automations" 
        description={`Active automations for ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Automations", active: true }
        ]}
      />

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search automations..." className="pl-10" />
            </div>
        </div>

        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {automations?.map((auto) => (
                    <Card key={auto.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{auto.name}</CardTitle>
                                </div>
                                <Badge variant={auto.enabled ? 'default' : 'secondary'}>
                                    {auto.enabled ? 'Enabled' : 'Disabled'}
                                </Badge>
                            </div>
                            <CardDescription className="flex items-center gap-1.5 mt-2 capitalize">
                                <Clock className="h-3 w-3" />
                                Trigger: {auto.trigger}
                            </CardDescription>
                            {auto.lastRun && (
                                <div className="mt-4 text-[10px] text-muted-foreground italic">
                                    Last run: {new Date(auto.lastRun).toLocaleString()}
                                </div>
                            )}
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )}

        <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
            All → Automations Page (Link to global list)
        </div>
      </PageContent>
    </PageContainer>
  );
}
