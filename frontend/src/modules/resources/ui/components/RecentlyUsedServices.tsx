'use client';

import React from "react";
import { ExternalService } from "@/shared/domain/resources";
import { Globe } from "lucide-react";

interface RecentlyUsedServicesProps {
  services: ExternalService[];
  onSelect: (id: string) => void;
}

export const RecentlyUsedServices = ({ services, onSelect }: RecentlyUsedServicesProps) => {
  if (services.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Recently Connected</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => onSelect(service.id)}
            className="flex items-center gap-4 p-4 rounded-2xl border bg-zinc-50/50 dark:bg-zinc-900/20 hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="p-2 rounded-xl bg-background border group-hover:border-primary/20 transition-colors">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold truncate">{service.service_name}</h4>
              <p className="text-[10px] font-mono text-muted-foreground truncate">{service.service_category}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
