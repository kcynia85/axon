"use client";

import * as React from "react";
import { useExternalServices } from "@/modules/resources/application/use-external-services";
import { ExternalService } from "@/shared/domain/resources";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Globe, ShieldCheck, Box, ExternalLink, Trash2 } from "lucide-react";
import { SidePeek } from "./side-peek";
import { Button } from "@/shared/ui/ui/button";

interface ServicesSectionProps {
  workspaceId: string;
}

export const ServicesSection = ({ workspaceId }: ServicesSectionProps) => {
  const { data: services, isLoading } = useExternalServices();
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border-dashed h-24 flex items-center justify-center text-muted-foreground text-sm italic">
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
            className="hover:border-primary/50 transition-all cursor-pointer group hover:shadow-md h-full"
            onClick={() => setSelectedServiceId(service.id)}
          >
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Globe className="h-3 w-3 text-primary shrink-0" />
                  <CardTitle className="text-sm font-bold truncate font-display">{service.service_name}</CardTitle>
                </div>
                <Badge variant="outline" className="text-[8px] h-3.5 px-1 py-0 font-mono opacity-60">HTTP</Badge>
              </div>
              <CardDescription className="text-[10px] mt-1 truncate lowercase opacity-60">
                {service.service_url}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <SidePeek
        open={!!selectedServiceId}
        onOpenChange={(open) => !open && setSelectedServiceId(null)}
        title={selectedService?.service_name || "Service Details"}
        description="External Integration Node"
      >
        {selectedService && (
          <div className="space-y-8">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-3 h-3" /> Capability Map
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {selectedService.capabilities?.map((cap: string, i: number) => (
                  <div key={i} className="p-2 rounded bg-muted/30 border border-primary/5 flex items-center gap-2">
                    <Box className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[10px] font-bold">{cap}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Endpoint Access</h4>
              <div className="p-3 rounded-lg bg-background border font-mono text-[10px] break-all">
                {selectedService.service_url}
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 gap-2">
                <ExternalLink className="w-3 h-3" /> Test Connection
              </Button>
              <Button variant="ghost" size="icon" className="text-destructive">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
