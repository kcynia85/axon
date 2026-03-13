import { TemplateStudioContainer } from "@/modules/studio/features/template-studio/ui/TemplateStudioContainer";

export default async function EditTemplateStudioPage({ params }: { params: Promise<{ workspace: string; id: string }> }) {
  const { workspace, id } = await params;
  return <TemplateStudioContainer workspaceId={workspace} templateId={id} />;
}
