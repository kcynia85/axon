"use client";

import { useParams } from "next/navigation";
import { usePatterns, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Input } from "@/shared/ui/ui/Input";
import { Search, Box } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

import { shouldShowPagination } from "@/shared/lib/pagination";

/**
 * PatternsListPage - Dedicated list view for a workspace (Read-only).
 * Based on Overview screen from axon_bb_workspace_patterns.pdf
 */
export default function PatternsListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: patterns, isLoading } = usePatterns(workspaceId);

  const showPagination = patterns ? shouldShowPagination(patterns.length) : false;

  return (
    <PageContainer>
      <PageHeader 
        title="Patterns" 
        description={`Behavior & Workflow patterns for ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Patterns", active: true }
        ]}
      />

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search patterns..." className="pl-10" />
            </div>
        </div>

        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {patterns?.map((pattern) => (
                    <Card key={pattern.id} className="group hover:border-primary/50 transition-colors cursor-pointer">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Box className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                                </div>
                                <Badge variant="secondary" className="capitalize">{pattern.type}</Badge>
                            </div>
                            <CardDescription className="mt-2 line-clamp-2">
                                {pattern.description}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )}

        {showPagination && (
          <div className="mt-12 flex items-center justify-start text-sm text-muted-foreground">
              Pagination: Patterns (Placeholder)
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
