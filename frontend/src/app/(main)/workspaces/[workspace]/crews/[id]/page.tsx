"use client";

import { useParams, useRouter } from "next/navigation";
import { useCrews } from "@/modules/workspaces/application/useWorkspaces";
import { CrewProfilePeek } from "@/modules/workspaces/ui/CrewProfilePeek";

export default function CrewSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const crewId = params.id as string;
  
  const { data: crews } = useCrews(workspaceId);
  const crew = crews?.find((crewItem) => crewItem.id === crewId) || null;

  if (!crew) return null;

  return (
    <CrewProfilePeek
      crew={crew}
      isOpen={true}
      onClose={() => router.push(`/workspaces/${workspaceId}/crews`)}
      onEdit={() => router.push(`/workspaces/${workspaceId}/crews/studio/${crewId}`)}
    />
  );
}
