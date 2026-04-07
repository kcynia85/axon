"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAutomations, useDeleteAutomation } from "../application/useAutomations";
import { useAutomationDraft } from "@/modules/studio/features/automation-studio/application/useAutomationDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import {
  Zap,
  Plus
} from "lucide-react";
import { Card } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { toast } from "sonner";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { AutomationSidePeekContent } from "./AutomationSidePeekContent";

type AutomationsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const AutomationsSection = ({ workspaceId, colorName = "default" }: AutomationsSectionProps) => {
  const router = useRouter();
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const { draft, clearDraft } = useAutomationDraft(workspaceId);
  const { mutate: deleteAutomation } = useDeleteAutomation(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [selectedAutomationId, setSelectedAutomationId] = React.useState<string | null>(null);
  const [automationToDeleteId, setAutomationToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic automatyzacji usunięty");
      }
      return;
    }

    setAutomationToDeleteId(id);
  };

  const confirmDelete = () => {
    if (automationToDeleteId) {
      const automationId = automationToDeleteId;
      const automation = automations?.find(automationItem => automationItem.id === automationId);
      if (automation) {
        deleteWithUndo(automationId, automation.automation_name, () => deleteAutomation(automationId));
      }
      setAutomationToDeleteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="aspect-[2/3] w-[236px] shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!draft && (!automations || automations.length === 0)) {
    return (
      <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 gap-4">
        <span>No automations active. Set some triggers.</span>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => router.push(`/workspaces/${workspaceId}/automations/studio`)}
          className="gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Automation
        </Button>
      </Card>
    );
  }

  const displayAutomations = (automations || []).slice(0, 3);

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayAutomations.map((automation) => (
          <WorkspaceCardHorizontal 
            key={automation.id}
            title={automation.automation_name}
            description={automation.automation_description || `${automation.automation_platform} Integration`}
            href="#"
            icon={Zap}
            resourceId={automation.id}
            onEdit={() => {
              router.push(`/workspaces/${workspaceId}/automations/studio/${automation.id}`);
            }}
            onClick={() => setSelectedAutomationId(automation.id)}
            onDelete={handleDelete}
            colorName={colorName}
          />
        ))}
      </div>

      {selectedAutomationId && (
          <AutomationSidePeekContent 
              workspaceId={workspaceId} 
              automationId={selectedAutomationId} 
              onClose={() => setSelectedAutomationId(null)}
              onDelete={handleDelete}
          />
      )}

      <DestructiveDeleteModal
        isOpen={!!automationToDeleteId}
        onClose={() => setAutomationToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Automation"
        resourceName={automations?.find(a => a.id === automationToDeleteId)?.automation_name || "this automation"}
        affectedResources={[]}
      />
    </>
  );
};
