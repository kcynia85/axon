"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTemplates, useDeleteTemplate } from "../application/useTemplates"; // Import useDeleteTemplate
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { TemplateProfilePeek } from "./TemplateProfilePeek";

type TemplatesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const TemplatesSection = ({ workspaceId, colorName = "default" }: TemplatesSectionProps) => {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);
  const deleteTemplateMutation = useDeleteTemplate(workspaceId); // Initialize delete mutation

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No templates registered. Draft some structures.
      </Card>
    );
  }

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId) || null;

  const handleDelete = async (templateId: string) => {
    try {
      await deleteTemplateMutation.mutateAsync(templateId);
      setSelectedTemplateId(null); // Close peek after deletion
      // Optionally, show a success toast
      // toast.success("Template deleted successfully!");
    } catch (error) {
      console.error("Failed to delete template:", error);
      // Optionally, show an error toast
      // toast.error("Failed to delete template.");
    }
  };

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <WorkspaceCardHorizontal 
            key={template.id}
            title={template.template_name}
            description={template.template_description}
            href={`/workspaces/${workspaceId}/templates/${template.id}`}
            badgeLabel="Structure"
            tags={template.template_keywords}
            onEdit={() => setSelectedTemplateId(template.id)}
            onDelete={handleDelete} // Pass the handleDelete function
            resourceId={template.id} // Pass template.id here
            colorName={colorName}
          />
          ))}
      </div>

      <TemplateProfilePeek 
        template={selectedTemplate}
        isOpen={!!selectedTemplateId}
        onClose={() => setSelectedTemplateId(null)}
        onEdit={() => {
          if (selectedTemplateId) {
            router.push(`/workspaces/${workspaceId}/templates/studio/${selectedTemplateId}`);
          }
        }}
        onDelete={handleDelete} // Pass the handleDelete function to the peek
      />
    </>
  );
};
