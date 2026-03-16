import { AgentStudioContainer } from "@/modules/studio/features/agent-studio/ui/AgentStudioContainer";

export default async function EditAgentStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AgentStudioContainer agentId={id} />;
}
