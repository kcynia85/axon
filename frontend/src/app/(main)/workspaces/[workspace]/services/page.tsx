"use client";

import { useParams } from "next/navigation";
import { useServices, useWorkspace } from "@/modules/workspaces/application/use-workspaces";
import { PageHeader } from "@/shared/ui/layout/page-header";
import { PageContainer } from "@/shared/ui/layout/page-container";
import { PageContent } from "@/shared/ui/layout/page-content";
import { Input } from "@/shared/ui/ui/input";
import { Search, Globe } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Badge } from "@/shared/ui/ui/badge";
import { Skeleton } from "@/shared/ui/ui/skeleton";

/**
 * ServicesListPage - Dedicated list view for a workspace (Read-only).
 * External services assigned to this workspace.
 */
export default function ServicesListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: services, isLoading } = useServices(workspaceId);

  return (
    <PageContainer>
      <PageHeader 
        title="Services" 
        description={`External services available in ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Services", active: true }
        ]}
      />

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search services..." className="pl-10" />
            </div>
        </div>

        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-32 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {services?.map((service) => (
                    <Card key={service.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{service.name}</CardTitle>
                                </div>
                                <Badge 
                                    variant={service.status === 'active' ? 'default' : service.status === 'error' ? 'destructive' : 'secondary'}
                                >
                                    {service.status}
                                </Badge>
                            </div>
                            <CardDescription className="mt-2 font-mono text-xs truncate">
                                {service.url}
                            </CardDescription>
                            <div className="mt-4 text-xs text-muted-foreground">
                                Auth Type: <span className="capitalize">{service.authType}</span>
                            </div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )}

        <div className="mt-12 flex items-center justify-center text-sm text-muted-foreground">
            All → External Services (Global Link)
        </div>
      </PageContent>
    </PageContainer>
  );
}
