"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useAutomations } from "@/modules/workspaces/application/useWorkspaces";
import { Zap, Layout, Info, Tag, Layers } from "lucide-react";

/**
 * AutomationSidePeekPage - Dedicated detail view for Automations.
 * Following the structure from Resources spec (Invoice OCR Scanner example).
 */
export default function AutomationSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const automationId = params.id as string;
  
  const { data: automations } = useAutomations(workspaceId);
    const automation = automations?.find((automationItem) => automationItem.id === automationId);

  if (!automation) return null;

  return (
    <SidePeek 
        title={automation.name} 
        subtitle={automation.status}
        footer={
            <Button className="w-full gap-2" variant="outline" onClick={() => router.push(`/resources/automations/${automationId}/edit`)}>
                Edytuj Automatyzację
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Description (AI) */}
            <section className="space-y-3">
                <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                    <Info className="h-3 w-3" /> Opis (AI)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {automation.description || "Brak opisu."}
                </p>
            </section>

            {/* Keywords */}
            <section className="space-y-3">
                <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                        {automation.keywords?.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="font-normal text-[10px]">#{keyword}</Badge>
                    )) || <Badge variant="secondary" className="font-normal text-[10px]">#finanse</Badge>}
                </div>
            </section>

            <Separator />

            {/* Context (Input Fields) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" /> Context
                </h3>
                <div className="space-y-2">
                    {automation.context?.map((field, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                            <span className="font-medium">{field.name}</span>
                            <span className="text-muted-foreground">({field.type})</span>
                        </div>
                    )) || (
                        <>
                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                                <span className="font-medium">file_url</span>
                                <span className="text-muted-foreground">(URL)</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                                <span className="font-medium">doc_type</span>
                                <span className="text-muted-foreground">(Text)</span>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Artefact (Output Fields) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Artefact
                </h3>
                <div className="space-y-2">
                    {automation.artefacts?.map((field, i) => (
                        <div key={i} className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                            <span className="font-medium">{field.name}</span>
                            <span className="text-muted-foreground">({field.type})</span>
                        </div>
                    )) || (
                        <>
                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                                <span className="font-medium">total</span>
                                <span className="text-muted-foreground">(Number)</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/30 rounded border border-dashed text-xs">
                                <span className="font-medium">currency</span>
                                <span className="text-muted-foreground">(Text)</span>
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Separator />

            {/* Accessibility / Workspaces */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Dostępność (Workspaces)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {automation.workspaces?.map(ws => (
                        <Badge key={ws} variant="outline" className="text-[10px]">{ws}</Badge>
                    )) || <Badge variant="outline" className="text-[10px]">Growth & Market</Badge>}
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
