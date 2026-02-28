"use client";

import { useParams } from "next/navigation";
import { useTemplates, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageHeader } from "@/shared/ui/layout/PageHeader";
import { PageContainer } from "@/shared/ui/layout/PageContainer";
import { PageContent } from "@/shared/ui/layout/PageContent";
import { Button } from "@/shared/ui/ui/Button";
import { Input } from "@/shared/ui/ui/Input";
import { Plus, Search, Copy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import Link from "next/link";

import { shouldShowPagination } from "@/shared/lib/pagination";

/**
 * TemplatesListPage - Dedicated list view for a workspace.
 * Based on Overview screen from axon_bb_workspace_templates.pdf
 */
export default function TemplatesListPage() {
  const params = useParams();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: templates, isLoading } = useTemplates(workspaceId);

  const showPagination = templates ? shouldShowPagination(templates.length) : false;

  return (
    <PageContainer>
      <PageHeader 
        title="Templates" 
        description={`Agent & Process templates for ${workspace?.name || 'workspace'}.`}
        breadcrumbs={[
            { label: "Workspaces", href: "/workspaces" },
            { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
            { label: "Templates", active: true }
        ]}
      >
        <Button asChild>
          <Link href={`/workspaces/${workspaceId}/templates/new`}>
            <Plus className="mr-2 h-4 w-4" /> Nowy Template
          </Link>
        </Button>
      </PageHeader>

      <PageContent>
        <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search templates..." className="pl-10" />
            </div>
        </div>

        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2].map(i => <Skeleton key={i} className="h-40 w-full" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates?.map((template) => (
                    <Card key={template.id} className="group hover:border-primary/50 transition-colors">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <Copy className="h-5 w-5 text-primary" />
                                    <CardTitle className="text-lg">{template.name}</CardTitle>
                                </div>
                                <Badge variant="outline">{template.category}</Badge>
                            </div>
                            <CardDescription className="mt-2 line-clamp-2">
                                {template.description}
                            </CardDescription>
                            <div className="flex flex-wrap gap-1 mt-3">
                                {template.tags.map(tag => (
                                    <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                                ))}
                            </div>
                        </CardHeader>
                        <CardFooter className="flex justify-end border-t pt-4">
                            <Button variant="ghost" size="sm" asChild className="h-8">
                                <Link href={`/workspaces/${workspaceId}/templates/${template.id}/edit`}>Edit</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {showPagination && (
          <div className="mt-12 flex items-center justify-start text-sm text-muted-foreground">
              Pagination: Templates (Placeholder)
          </div>
        )}
      </PageContent>
    </PageContainer>
  );
}
