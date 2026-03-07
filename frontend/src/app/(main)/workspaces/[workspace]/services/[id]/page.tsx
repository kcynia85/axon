"use client";

import { useParams, useRouter } from "next/navigation";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Badge } from "@/shared/ui/ui/Badge";
import { Button } from "@/shared/ui/ui/Button";
import { Separator } from "@/shared/ui/ui/Separator";
import { useServices } from "@/modules/workspaces/application/useWorkspaces";
import { Activity, Zap, Layers, Briefcase, Globe } from "lucide-react";

export default function ServiceSidePeekPage() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  const serviceId = params.id as string;
  
  const { data: services } = useServices(workspaceId);
    const service = services?.find((serviceItem) => serviceItem.id === serviceId);

  if (!service) return null;

  return (
    <SidePeek 
        title={service.service_name} 
        description={service.service_category}
        open={true}
        onOpenChange={() => router.push(`/workspaces/${workspaceId}/services`)}
        modal={false}
        footer={
            <Button className="w-full gap-2" variant="outline" onClick={() => router.push(`/workspaces/${workspaceId}/services/${serviceId}/edit`)}>
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
                        <div className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                            <Globe className="h-3 w-3" /> Endpoint
                        </div>
                        <div className="text-[10px] font-mono p-2 bg-muted/20 rounded border border-dashed truncate">
                            {service.service_url}
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <div className="text-xs text-muted-foreground">Description</div>
                        <p className="text-sm text-muted-foreground leading-relaxed italic">
                            {service.service_description}
                        </p>
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
                    {service.capabilities.map((cap, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs p-2 bg-muted/30 rounded border border-dashed">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {cap}
                        </div>
                    ))}
                </div>
            </section>

            <Separator />

            {/* Accessibility / Workspaces Section */}
            <section className="space-y-3">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                    <Layers className="h-4 w-4 text-primary" /> Availability
                </h3>
                <div className="flex flex-wrap gap-2">
                    {service.availability_workspace.map(ws => (
                        <Badge key={ws} variant="outline" className="text-[10px]">{ws}</Badge>
                    ))}
                </div>
            </section>

            {/* Status (Technical info kept small at the bottom) */}
            <section className="pt-4 flex items-center justify-between opacity-60">
                 <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-bold">
                    <Activity className="h-3 w-3" /> Protocol Established
                </div>
                <div className="text-[10px] text-muted-foreground">
                    ID: {service.id.slice(0, 8)}
                </div>
            </section>
        </div>
    </SidePeek>
  );
}
