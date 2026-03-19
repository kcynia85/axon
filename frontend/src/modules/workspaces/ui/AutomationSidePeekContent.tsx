"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { 
  Edit2, 
  Trash2, 
  HelpCircle, 
  Link as LinkIcon, 
  Type,
  Zap
} from "lucide-react";
import { useAutomations, useDeleteAutomation } from "../application/useAutomations";
import { toast } from "sonner";
import { getWorkspaceLabel } from "../domain/constants";
import { Automation } from "@/shared/domain/workspaces";

type AutomationSidePeekContentProps = {
  readonly workspaceId: string;
  readonly automationId: string;
  readonly onClose: () => void;
  readonly automation?: Automation;
  readonly onDelete?: (id: string) => void;
};

const FieldTypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'file':
    case 'pdf':
    case 'link':
    case 'url':
      return <LinkIcon className="w-4 h-4 text-muted-foreground/70" />;
    default:
      return <Type className="w-4 h-4 text-muted-foreground/70" />;
  }
};

export const AutomationSidePeekContent = ({
  workspaceId,
  automationId,
  onClose,
  automation: initialAutomation,
  onDelete,
}: AutomationSidePeekContentProps) => {
  const router = useRouter();
  const { data: automations } = useAutomations(workspaceId);
  
  const automation = initialAutomation || automations?.find((a) => a.id === automationId);

  if (!automation) return null;

  const handleEdit = () => {
    router.push(`/workspaces/${workspaceId}/automations/studio/${automationId}`);
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(automationId);
      onClose();
    }
  };

  // Map schemas
  const contexts = Object.entries(automation.automation_input_schema || {});
  const artefacts = Object.entries(automation.automation_output_schema || {});

  const availabilityLabels = (automation.availability_workspace || [])
    .map(getWorkspaceLabel)
    .filter(Boolean)
    .sort();

  return (
    <SidePeek 
        title={automation.automation_name} 
        description={
          <div className="flex flex-col gap-2 mt-1">
            <Badge variant="secondary" className="w-fit text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-none h-5 px-2">
              {automation.automation_platform}
            </Badge>
          </div>
        }
        open={true}
        onOpenChange={(open) => !open && onClose()}
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
              onClick={handleDelete}
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
        }
    >
        <div className="space-y-12">
            {/* ── Main Description ── */}
            <div className="bg-muted/50 p-4 rounded-xl">
              <p className="text-base leading-relaxed text-foreground/80 font-normal">
                {automation.automation_description || "Brak opisu automatyzacji."}
              </p>
            </div>

            {/* ── Keywords ── */}
            {automation.automation_keywords && automation.automation_keywords.length > 0 && (
              <section className="space-y-4">
                <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
                <div className="flex flex-wrap gap-1.5">
                  {automation.automation_keywords.map((kw, i) => (
                    <Badge key={i} variant="secondary" className="text-base font-normal">
                      #{kw}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* ── Context (Input Schema) ── */}
            <section className="space-y-4">
              <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
                Context
                <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
              </h4>
              <div className="space-y-1.5">
                {contexts.length > 0 ? (
                  contexts.map(([name, config], i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                      <div className="flex items-center gap-2">
                        <FieldTypeIcon type={String((config as any).field_type || config)} />
                        <span className="text-base font-mono font-semibold">{name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold uppercase">
                        {String((config as any).field_type || config)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic px-1">No context items defined.</div>
                )}
              </div>
            </section>

            {/* ── Artefacts (Output Schema) ── */}
            <section className="space-y-4">
              <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
                Artefacts
                <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
              </h4>
              <div className="space-y-1.5">
                {artefacts.length > 0 ? (
                  artefacts.map(([name, config], i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                      <div className="flex items-center gap-2">
                        <FieldTypeIcon type={String((config as any).field_type || config)} />
                        <span className="text-base font-mono font-semibold">{name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs h-5 px-2 py-0 font-bold uppercase">
                        {String((config as any).field_type || config)}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-muted-foreground italic px-1">No artefacts defined.</div>
                )}
              </div>
            </section>

            {/* ── Availability ── */}
            <section className="space-y-4">
              <h4 className="text-base font-bold text-muted-foreground">
                Dostępność
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {availabilityLabels.length > 0 ? (
                  availabilityLabels.map((label) => (
                    <Badge key={label} variant="outline" className="text-base font-normal">
                      {label}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-base font-normal text-muted-foreground">Global</Badge>
                )}
              </div>
            </section>
        </div>
    </SidePeek>
  );
};
