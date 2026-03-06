"use client";

import * as React from "react";
import { useServices } from "../application/useServices";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Badge } from "@/shared/ui/ui/Badge";
import {
  Cloud,
  Activity,
  Zap,
} from "lucide-react";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";

type ServicesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
}

export const ServicesSection = ({ workspaceId, colorName = "default" }: ServicesSectionProps) => {
  const { data: services, isLoading } = useServices(workspaceId);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border-dashed h-32 flex items-center justify-start px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5">
        No external services connected. Scale with APIs.
      </Card>
    );
  }

  const selectedService = services.find((s) => s.id === selectedServiceId);

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <WorkspaceCardHorizontal 
            key={service.id}
            title={service.service_name}
            description={`Integration with ${service.provider_name} platform.`}
            href={`/workspaces/${workspaceId}/services/${service.id}`}
            badgeLabel={service.connection_status}
            icon={Cloud}
            onEdit={() => setSelectedServiceId(service.id)}
            colorName={colorName}
            footerContent={
                <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-green-500" />
                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Active</span>
                </div>
            }
          />
        ))}
      </div>

      <SidePeek
        open={!!selectedServiceId}
        onOpenChange={(open) => !open && setSelectedServiceId(null)}
        title={selectedService?.service_name || "Service Details"}
        description={`${selectedService?.provider_name} Integration`}
      >
        {selectedService && (
          <div className="space-y-6">
            <section className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Zap className="w-3 h-3" /> Connectivity
              </h4>
              <div className="bg-muted/30 p-4 rounded-lg border border-primary/5 space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-bold">{selectedService.provider_name}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="text-[10px]">{selectedService.connection_status}</Badge>
                </div>
              </div>
            </section>

            <div className="flex gap-3 pt-6 border-t border-muted">
              <Button className="flex-1 bg-primary hover:bg-primary/90">Sync Now</Button>
              <Button variant="outline" className="flex-1">Settings</Button>
            </div>
          </div>
        )}
      </SidePeek>
    </>
  );
};
