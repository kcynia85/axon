"use client";

import React, { useState } from "react";
import { Badge } from "@/shared/ui/ui/Badge";
import { SidePeek } from "@/shared/ui/layout/SidePeek";
import { Button } from "@/shared/ui/ui/Button";
import { Cloud, HelpCircle, Edit2, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { getWorkspaceLabel } from "../domain/constants";

import { ExternalService } from "@/shared/domain/resources";

type ServiceProfilePeekProps = {
  readonly service: ExternalService | null;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onEdit: (serviceId: string) => void;
  readonly onDelete: (serviceId: string) => void;
};

export const ServiceProfilePeek = ({
  service,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ServiceProfilePeekProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Helper to clean up URL for display - No useMemo, let React Compiler handle it
  const displayUrl = service?.service_url 
    ? service.service_url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '')
    : "external-service.io";

  return (
    <SidePeek
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title={service?.service_name || "Service Details"}
      description={
        service?.service_url ? (
          <a 
            href={service.service_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground underline hover:text-primary transition-all decoration-muted-foreground/40 underline-offset-2"
          >
            {displayUrl}
          </a>
        ) : (
          <span className="text-muted-foreground">{displayUrl}</span>
        )
      }
      modal={false}
      image={
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary/20 bg-black flex items-center justify-center text-primary">
          <Cloud className="w-6 h-6" />
        </div>
      }
      footer={
        <div className="flex w-full justify-between items-center">
          <Button 
            variant="ghost" 
            size="icon-lg"
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 shrink-0" 
            onClick={() => {
              if (service?.id) {
                onDelete(service.id);
                onClose();
              }
            }}
          >
            <Trash2 className="w-5 h-5" />
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 font-bold" 
            size="lg"
            onClick={() => service?.id && onEdit(service.id)}
          >
            <Edit2 className="w-5 h-5 mr-2" /> Edytuj Usługę
          </Button>
        </div>
      }
    >
      {service && (
        <div className="space-y-12">
          {/* ── 1. Description Block ── */}
          <div className="bg-muted/50 p-4 rounded-xl">
            <p className="text-base leading-relaxed text-foreground/80 font-normal">
              {service.service_description || "No business context provided for this service."}
            </p>
          </div>

          {/* ── 2. Category ── */}
          <section className="space-y-2">
            <h4 className="text-base font-bold text-muted-foreground">Category</h4>
            <div className="text-base font-bold text-foreground">
              {service.service_category}
            </div>
          </section>

          {/* ── 3. Keywords ── */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">Keywords</h4>
            <div className="flex flex-wrap gap-1.5">
              {service.service_keywords?.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-base font-normal">
                  #{keyword}
                </Badge>
              )) || <span className="text-zinc-500 italic text-base">None</span>}
            </div>
          </section>

          {/* ── 4. Capabilities ── */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground flex items-center gap-2">
              Capabilities
              <HelpCircle className="w-4 h-4 text-muted-foreground/50 cursor-help" />
            </h4>
            <div className="space-y-1.5">
              {(service.capabilities || [])
                .slice(0, isExpanded ? undefined : 3)
                .map((capability, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-primary/5">
                  <span className="text-base font-mono font-semibold">{capability.capability_name}</span>
                </div>
              ))}
              {service.capabilities?.length > 3 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground mt-2 transition-colors focus:outline-none"
                >
                  {isExpanded ? (
                    <>Show Less <ChevronUp className="w-4 h-4" /></>
                  ) : (
                    <>+ {service.capabilities.length - 3} More <ChevronDown className="w-4 h-4" /></>
                  )}
                </button>
              )}
              {(!service.capabilities || service.capabilities.length === 0) && (
                <div className="text-zinc-500 italic text-base">No capabilities defined.</div>
              )}
            </div>
          </section>

          {/* ── 5. Availability ── */}
          <section className="space-y-4">
            <h4 className="text-base font-bold text-muted-foreground">
              Availability
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {service.availability_workspace?.map((workspaceId) => (
                <Badge key={workspaceId} variant="outline" className="text-base font-normal">
                  {getWorkspaceLabel(workspaceId)}
                </Badge>
              )) || <span className="text-zinc-500 italic text-base">None</span>}
            </div>
          </section>
        </div>
      )}
    </SidePeek>
  );
};
