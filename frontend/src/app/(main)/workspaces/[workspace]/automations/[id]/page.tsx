"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useAutomations } from "@/modules/workspaces/application/useWorkspaces";
import { Zap, Layout, Info, Tag, Layers } from "lucide-react";

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
        title={automation.automation_name} 
        description={`${automation.automation_platform} Unit`}
        open={true}
        onOpenChange={() => router.push(`/workspaces/${workspaceId}/automations`)}
        footer={
            <Button className="w-full gap-2" variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}/automations/${automationId}/edit`)}>
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
                <div className="flex items-center justify-between mb-2">
                    <Badge variant={automation.automation_status === "Active" ? "default" : "outline"}>
                        {automation.automation_status}
                    </Badge>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {automation.automation_description || "Brak opisu."}
                </p>
            </section>

            {/* Keywords */}
            <section className="space-y-3">
                <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                    <Tag className="h-3 w-3" /> Keywords
                </h3>
                <div className="flex flex-wrap gap-1.5">
                        {automation.automation_keywords.map((keyword) => (
                            <Badge key={keyword} variant="secondary" className="font-normal text-[10px]">#{keyword}</Badge>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Context (Input Fields) */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layout className="h-4 w-4 text-primary" /> Webhook Detail
                </h3>
                <div className="p-3 rounded-lg bg-muted/20 border font-mono text-[10px] break-all border-dashed">
                    {automation.automation_webhook_url}
                </div>
                <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">HTTP Method</span>
                    <span className="font-bold">{automation.automation_http_method}</span>
                </div>
            </section>

            <Separator />

            {/* Accessibility / Workspaces */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Dostępność (Workspaces)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {automation.availability_workspace.map(ws => (
                        <Badge key={ws} variant="outline" className="text-[10px]">{ws}</Badge>
                    ))}
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
