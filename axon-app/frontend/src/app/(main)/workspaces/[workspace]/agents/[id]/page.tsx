"use client";

import { useParams, useRouter } from "next/navigation";
import { useAgents } from "@/modules/workspaces/application/useWorkspaces";
import { AgentProfilePeek } from "@/modules/agents/ui/AgentProfilePeek";

export default function AgentSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const agentId = params.id as string;
  
  const { data: agents } = useAgents(workspaceId);
  const agent = agents?.find((agentItem) => agentItem.id === agentId);

  if (!agent) return null;

  return (
    <AgentProfilePeek
      agent={agent}
      isOpen={true}
      onClose={() => router.push(`/workspaces/${workspaceId}/agents`)}
      onEdit={() => router.push(`/workspaces/${workspaceId}/agents/studio/${agentId}`)}
    />
  );
}
