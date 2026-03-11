"use client";

import { useParams, useRouter } from "next/navigation";
import { useTemplates } from "@/modules/workspaces/application/useTemplates";
import { TemplateProfilePeek } from "@/modules/workspaces/ui/TemplateProfilePeek";

/**
 * TemplateSidePeekPage: Displays details of a specific template in a side panel.
 */
export default function TemplateSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const templateId = params.id as string;
  
  const { data: templates } = useTemplates(workspaceId);
  const template = templates?.find((templateItem) => templateItem.id === templateId) || null;

  if (!template) return null;

  return (
    <TemplateProfilePeek
      template={template}
      isOpen={true}
      onClose={() => router.push(`/workspaces/${workspaceId}/templates`)}
      onEdit={() => router.push(`/workspaces/${workspaceId}/templates/studio?id=${templateId}`)}
    />
  );
}
