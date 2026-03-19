"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTemplates, useDeleteTemplate } from "../application/useTemplates";
import { useTemplateDraft } from "@/modules/studio/features/template-studio/application/hooks/useTemplateDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { TemplateProfilePeek } from "./TemplateProfilePeek";
import { toast } from "sonner";
import { FileText } from "lucide-react";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";

type TemplatesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const TemplatesSection = ({ workspaceId, colorName = "default" }: TemplatesSectionProps) => {
  const router = useRouter();
  const { data: templates, isLoading } = useTemplates(workspaceId);
  const { draft, clearDraft } = useTemplateDraft(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string | null>(null);
  const [isDraftSelected, setIsDraftSelected] = React.useState(false);
  const [templateToDeleteId, setTemplateToDeleteId] = React.useState<string | null>(null);
  
  const deleteTemplateMutation = useDeleteTemplate(workspaceId);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => (
          <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />
        ))}
      </div>
    );
  }

  const handleDelete = async (templateId: string) => {
    if (templateId === "draft") {
        if (window.confirm("Are you sure you want to discard this draft?")) {
            clearDraft();
            setIsDraftSelected(false);
            toast.success("Szkic usunięty");
        }
        return;
    }

    setTemplateToDeleteId(templateId);
  };

  const confirmDelete = () => {
    if (!templateToDeleteId) return;
    
    const template = templates?.find(t => t.id === templateToDeleteId);
    const name = template?.template_name || "Template";
    deleteWithUndo(templateToDeleteId, name, () => deleteTemplateMutation.mutate(templateToDeleteId));
    setTemplateToDeleteId(null);
  };

  // Map draft to Template structure for peek
  const draftTemplate = React.useMemo(() => {
    if (!draft) return null;
    return {
      id: "draft",
      template_name: draft.name || "New Template",
      template_description: draft.description || "Work in progress...",
      template_markdown_content: draft.markdown || "",
      template_keywords: draft.keywords || [],
      template_inputs: draft.context_items?.map(i => ({
          id: (i as any).id || "draft-in",
          label: i.name,
          expectedType: i.field_type,
          isRequired: i.is_required
      })) || [],
      template_outputs: draft.artefact_items?.map(o => ({
          id: (o as any).id || "draft-out",
          label: o.name,
          outputType: o.field_type,
          isRequired: o.is_required
      })) || [],
      template_checklist_items: [],
      availability_workspace: draft.availability_workspace || [workspaceId],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as any;
  }, [draft, workspaceId]);

  const selectedTemplate = templates?.find((t) => t.id === selectedTemplateId) || null;
  const activeTemplate = isDraftSelected ? draftTemplate : selectedTemplate;

  const displayTemplates = React.useMemo(() => {
    if (!templates) return [];
    return templates.slice(0, 3);
  }, [templates]);

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayTemplates.map((template) => (
          <WorkspaceCardHorizontal 
            key={template.id}
            title={template.template_name}
            description={template.template_description}
            href="#"
            tags={template.template_keywords}
            icon={FileText}
            onEdit={() => {
                router.push(`/workspaces/${workspaceId}/templates/studio/${template.id}`);
            }}
            onClick={() => {
                setIsDraftSelected(false);
                setSelectedTemplateId(template.id);
            }}
            onDelete={handleDelete}
            resourceId={template.id}
            colorName={colorName}
          />
          ))}

        {(!templates || templates.length === 0) && (
          <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 col-span-full">
            No templates registered. Draft some structures.
          </Card>
        )}
      </div>

      <TemplateProfilePeek 
        template={activeTemplate}
        isOpen={isDraftSelected || !!selectedTemplateId}
        onClose={() => {
            setIsDraftSelected(false);
            setSelectedTemplateId(null);
        }}
        onEdit={() => {
          if (isDraftSelected) {
            router.push(`/workspaces/${workspaceId}/templates/studio`);
          } else if (selectedTemplateId) {
            router.push(`/workspaces/${workspaceId}/templates/studio/${selectedTemplateId}`);
          }
        }}
        onDelete={handleDelete}
      />

      <DestructiveDeleteModal
        isOpen={!!templateToDeleteId}
        onClose={() => setTemplateToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Template"
        resourceName={templates?.find(t => t.id === templateToDeleteId)?.template_name || "this template"}
        affectedResources={[]}
      />
    </>
  );
};
