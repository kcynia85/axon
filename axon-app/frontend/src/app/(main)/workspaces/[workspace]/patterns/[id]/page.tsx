"use client";

import { useParams, useRouter } from "next/navigation";
import { usePatterns } from "@/modules/workspaces/application/useWorkspaces";
import { PatternProfilePeek } from "@/modules/workspaces/ui/PatternProfilePeek";

export default function PatternSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const patternId = params.id as string;
  
  const { data: patterns } = usePatterns(workspaceId);
  const pattern = patterns?.find((patternItem) => patternItem.id === patternId) || null;

  if (!pattern) return null;

  return (
    <PatternProfilePeek
      pattern={pattern}
      isOpen={true}
      onClose={() => router.push(`/workspaces/${workspaceId}/patterns`)}
      onInstantiate={() => {}} // TODO: Handle instantiate
    />
  );
}
