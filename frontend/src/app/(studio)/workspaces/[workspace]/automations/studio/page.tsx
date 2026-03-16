import { AutomationStudioContainer } from "@/modules/studio/features/automation-studio/ui/AutomationStudioContainer";

export default async function NewAutomationStudioPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;
  return <AutomationStudioContainer workspaceId={workspace} />;
}
