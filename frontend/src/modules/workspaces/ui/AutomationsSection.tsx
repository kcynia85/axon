"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAutomations, useDeleteAutomation } from "../application/useAutomations";
import { useAutomationDraft } from "@/modules/studio/features/automation-studio/application/useAutomationDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Zap,
  Settings,
  Trash2,
  Clock,
  History,
  Edit2,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { toast } from "sonner";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

type AutomationsSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const AutomationsSection = ({ workspaceId, colorName = "default" }: AutomationsSectionProps) => {
  const router = useRouter();
  const { data: automations, isLoading } = useAutomations(workspaceId);
  const { draft, clearDraft } = useAutomationDraft(workspaceId);
  const { mutate: deleteAutomation } = useDeleteAutomation(workspaceId);
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
      deleteAutomation(automationToDeleteId);
      setAutomationToDeleteId(null);
      toast.success("Automatyzacja usunięta");
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
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No automations active. Set some triggers.
      </Card>
    );
  }

  const selectedAutomation = automations?.find((a) => a.id === selectedAutomationId);

  const handleEdit = () => {
    if (selectedAutomationId) {
      router.push(`/workspaces/${workspaceId}/automations/studio/${selectedAutomationId}`);
    }
  };

  const displayAutomations = React.useMemo(() => {
    if (!automations) return [];
    return automations.slice(0, 3);
  }, [automations]);

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayAutomations.map((automation) => (
          <WorkspaceCardHorizontal 
            key={automation.id}
            title={automation.automation_name}
            description={`${automation.automation_platform} Integration`}
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

      <SidePeek
        open={!!selectedAutomationId}
        onOpenChange={(open) => !open && setSelectedAutomationId(null)}
        title={selectedAutomation?.automation_name || "Automation Details"}
        description={`${selectedAutomation?.automation_platform} Integration`}
        modal={false}
        image={
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black flex items-center justify-center text-primary">
            <Zap className="w-6 h-6" />
          </div>
        }
        footer={
          <div className="flex w-full justify-between items-center">
            <Button 
              variant="ghost" 
              size="icon-lg"
              className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
              onClick={() => {
                if (selectedAutomationId) {
                  handleDelete(selectedAutomationId);
                  setSelectedAutomationId(null);
                }
              }}
            >
              <Trash2 className="w-5 h-5" />
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 font-bold" 
              size="lg"
              onClick={handleEdit}
            >
              <Edit2 className="w-4 h-4 mr-2" /> Edytuj Automatyzację
            </Button>
          </div>
        }      >
        {selectedAutomation && (
          <div className="space-y-12">
            {/* ── 1. Description Block ── */}
            <div className="bg-muted/50 p-4 rounded-xl">
              <p className="text-base leading-relaxed text-foreground/80 font-normal">
                Automatyzacja procesów w ramach platformy {selectedAutomation.automation_platform}. Obsługuje zdarzenia systemowe i integracje zewnętrzne.
              </p>
            </div>

            {/* ── 2. Metadata Summary ── */}
            <div className="grid grid-cols-2 gap-4 pb-10 border-b border-muted">
              <div className="space-y-2">
                <div className="text-base font-bold text-muted-foreground">Platform</div>
                <div className="text-base font-bold">{selectedAutomation.automation_platform}</div>
              </div>
              <div className="space-y-2">
                <div className="text-base font-bold text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm font-bold bg-blue-500/10 text-blue-600 border-none px-2">{selectedAutomation.automation_status}</Badge>
                </div>
              </div>
            </div>

            {/* ── 3. Execution Logic ── */}
            <section className="space-y-4">
              <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
                <History className="w-4 h-4" /> Execution Logic
              </h4>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-primary/60 shrink-0" />
                    <span className="text-base font-medium">Trigger Type</span>
                  </div>
                  <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold uppercase">
                    Event-based
                  </Badge>
                </div>
              </div>
            </section>
          </div>
        )}
      </SidePeek>

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
