import { AutomationStudioContainer } from "@/modules/studio/features/automation-studio/ui/AutomationStudioContainer";

export default async function EditAutomationStudioPage({ params }: { params: Promise<{ workspace: string; id: string }> }) {
  const { workspace, id } = await params;
  return <AutomationStudioContainer workspaceId={workspace} automationId={id} />;
}
