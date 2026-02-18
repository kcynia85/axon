"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/side-peek";
import { Badge } from "@/shared/ui/ui/badge";
import { Button } from "@/shared/ui/ui/button";
import { Separator } from "@/shared/ui/ui/separator";
import { useServices } from "@/modules/workspaces/application/use-workspaces";
import { Globe, Shield, ExternalLink, Activity, Zap, Layers, Briefcase } from "lucide-react";

/**
 * ServiceSidePeekPage - Dedicated detail view for External Services.
 * Following the structure from Resources spec provided by user.
 */
export default function ServiceSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const serviceId = params.id as string;
  
  const { data: services } = useServices(workspaceId);
  const service = services?.find(s => s.id === serviceId);

  if (!service) return null;

  return (
    <SidePeek 
        title={service.name} 
        subtitle={service.url}
        footer={
            <Button className="w-full gap-2" variant="outline" onClick={() => router.push(`/resources/services/${serviceId}/edit`)}>
                Edytuj Service
            </Button>
        }
    >
        <div className="space-y-8">
            {/* Business Context Section */}
            <section className="space-y-4">
                <h3 className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider flex items-center gap-2">
                    <Briefcase className="h-3 w-3" /> Business Context
                </h3>
                
                <div className="grid gap-4">
                    <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Category</div>
                        <div className="text-sm font-medium">{service.category || "GenAI"}</div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Keywords</div>
                        <div className="flex flex-wrap gap-1.5">
                            {service.keywords?.map(k => (
                                <Badge key={k} variant="secondary" className="font-normal text-[10px]">#{k}</Badge>
                            )) || <Badge variant="secondary" className="font-normal text-[10px]">#audio</Badge>}
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Capabilities Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" /> Capabilities
                </h3>
                <div className="grid grid-cols-1 gap-2">
                    {service.capabilities?.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded border border-dashed">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {cap}
                        </div>
                    )) || (
                        <>
                            <div className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded border border-dashed">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Text-to-Speech
                            </div>
                            <div className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded border border-dashed">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                Voice Cloning
                            </div>
                        </>
                    )}
                </div>
            </section>

            <Separator />

            {/* Accessibility / Workspaces Section */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Dostępność (Workspaces)
                </h3>
                <div className="flex flex-wrap gap-2">
                    {service.workspaces?.map(ws => (
                        <Badge key={ws} variant="outline" className="text-[10px]">{ws}</Badge>
                    )) || <Badge variant="outline" className="text-[10px]">Growth & Market</Badge>}
                </div>
            </section>

            {/* Status (Technical info kept small at the bottom) */}
            <section className="pt-4 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                    <Activity className="h-3 w-3" /> Status: {service.status}
                </div>
                <div className="text-[10px] text-muted-foreground">
                    Auth: {service.authType}
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
