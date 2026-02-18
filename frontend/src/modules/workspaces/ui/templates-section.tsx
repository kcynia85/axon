"use client";

import { useTemplates } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Copy } from "lucide-react";
import Link from "next/link";

interface TemplatesSectionProps {
  workspaceId: string;
}

export const TemplatesSection = ({ workspaceId }: TemplatesSectionProps) => {
  const { data: templates, isLoading } = useTemplates(workspaceId);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
    );
  }

  if (!templates || templates.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No templates defined yet.</div>;
  }

  const previewTemplates = templates.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewTemplates.map((template) => (
        <Link key={template.id} href={`/workspaces/${workspaceId}/templates/${template.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-sm font-semibold truncate pr-4">{template.name}</CardTitle>
                </div>
                {template.tags && template.tags.length > 0 && (
                    <div className="mt-1 text-[10px] text-muted-foreground italic">
                        #{template.tags[0]}
                    </div>
                )}
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
