"use client";

import { useParams, useRouter } from "next/navigation";
import { AutomationSidePeekContent } from "@/modules/workspaces/ui/AutomationSidePeekContent";

export default function AutomationSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const automationId = params.id as string;

  return (
    <AutomationSidePeekContent 
        workspaceId={workspaceId} 
        automationId={automationId} 
        onClose={() => router.push(`/workspaces/${workspaceId}/automations`)}
    />
  );
}
