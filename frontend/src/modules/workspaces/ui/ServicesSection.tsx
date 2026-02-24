"use client";

import * as React from "react";
import { useExternalServices } from "@/modules/resources/application/useExternalServices";
import { ExternalService } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/Card";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import { Globe, ShieldCheck, Box, ExternalLink, Trash2, Activity } from "lucide-react";
import { SidePeek } from "./SidePeek";
import { Button } from "@/shared/ui/ui/Button";

export const ServicesSection = () => {
  const { data: services, isLoading } = useExternalServices();
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full" />)}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-center text-muted-foreground text-sm italic">
        No external services linked to this domain.
      </Card>
    );
  }

  const selectedService = services.find((s: ExternalService) => s.id === selectedServiceId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service: ExternalService) => (
          <Card
            key={service.id}
            className="hover:border-primary/50 transition-all cursor-pointer group relative hover:shadow-lg h-full"
            onClick={() => setSelectedServiceId(service.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Globe className="h-3 w-3 text-primary shrink-0" />
                  </div>
                  <CardTitle className="text-sm font-bold truncate font-display">{service.service_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 font-mono opacity-60">
                  {service.service_category || "API"}
                </Badge>
              </div>

              {service.service_description && (
                <CardDescription className="text-[11px] mt-2 line-clamp-2 leading-relaxed opacity-70">
                  {service.service_description}
                </CardDescription>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span className="text-[9px] text-muted-foreground font-mono opacity-40 lowercase truncate flex-1 mr-2 px-1">
                  {service.service_url}
                </span>
                <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-20">Link Established</span>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedServiceId}
        onOpenChange={(open) => !open && setSelectedServiceId(null)}
        title={selectedService?.service_name || "Service Details"}
        description={`${selectedService?.service_category || "External"} Integration Node`}
      >
        {selectedService && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Capability Map
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedService.capabilities?.map((cap: string, i: number) => (
                  <div key={i} className="p-2.5 rounded bg-muted/30 border border-primary/5 flex items-center gap-2 transition-colors hover:bg-muted/50">
                    <Box className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold">{cap}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ExternalLink className="w-3 h-3" /> Endpoint Access
              </h4>
              <div className="p-3 rounded-lg bg-background border border-dashed font-mono text-[10px] break-all opacity-80">
                {selectedService.service_url}
              </div>
            </section>

            {selectedService.availability_workspace && selectedService.availability_workspace.length > 0 && (
              <section className="space-y-3">
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Availability
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedService.availability_workspace.map((wsId: string) => (
                    <Badge key={wsId} variant="outline" className="text-[10px] font-normal">
                      {wsId.replace("ws-", "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-3 h-3" /> Health & Performance
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Uptime (24h)</span>
                  <span className="font-bold text-green-500">100%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Security Protocol</span>
                  <span className="font-bold">AES-256 / JWT</span>
                </div>
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 gap-2 bg-primary hover:bg-primary/90">
                <ExternalLink className="w-3 h-3" /> Test Integration
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
