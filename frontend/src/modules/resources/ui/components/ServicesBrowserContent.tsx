'use client';

import React from "react";
import { ExternalService } from "@/shared/domain/resources";
import { ViewMode } from "@/shared/lib/hooks/useViewMode";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Globe, ShieldCheck, Activity, Settings, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/ui/Button";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/ui/DropdownMenu";

interface ServicesBrowserContentProps {
  services: ExternalService[];
  viewMode: ViewMode;
  onViewDetails: (id: string) => void;
  onDelete?: (id: string) => void;
  isLoading: boolean;
  isError: boolean;
}

export const ServicesBrowserContent = ({
  services,
  viewMode,
  onViewDetails,
  onDelete,
  isLoading,
  isError
}: ServicesBrowserContentProps) => {
  if (isLoading) {
    return (
      <div className={cn(
        "grid gap-6",
        viewMode === "grid" ? "md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
      )}>
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <Skeleton key={index} className={cn("w-full", viewMode === "grid" ? "h-48" : "h-24")} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-20 text-destructive">Failed to load services.</div>;
  }

  if (services.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No services found matching your criteria.</div>;
  }

  if (viewMode === "grid") {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card 
            key={service.id} 
            className="group relative hover:border-primary/50 transition-all flex flex-col cursor-pointer"
            onClick={() => onViewDetails(service.id)}
          >
            {onDelete && (
                <div className="absolute top-2 right-2 z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                onClick={(e) => { e.stopPropagation(); }}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                                variant="destructive"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(service.id);
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            <CardHeader className="pb-3 bg-muted/20 pr-12">
                <div className="flex justify-between items-start">
                    <div className="p-2 rounded bg-background border">
                        <Globe className="w-4 h-4 text-primary" />
                    </div>
                    <Badge variant="secondary" className="text-[8px] h-4">
                        {service.service_category}
                    </Badge>
                </div>
                <CardTitle className="text-sm font-bold mt-4">{service.service_name}</CardTitle>
                <CardDescription className="text-[10px] font-mono lowercase truncate mt-1 text-primary/70">
                    {service.service_url}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-4 space-y-4">
                <div className="space-y-2">
                    <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                        <ShieldCheck className="w-2 h-2" /> Capabilities
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {service.capabilities?.map((capability: any, index: number) => (
                            <span key={index} className="px-1.5 py-0.5 rounded-full bg-primary/5 border border-primary/10 text-[8px] font-bold">
                                {capability.name || capability}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-muted/50 mt-auto">
                    <div className="flex items-center gap-2">
                        <Activity className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] font-bold">99.9% Uptime</span>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}><Settings className="w-3 h-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); }}><ExternalLink className="w-3 h-3" /></Button>
                    </div>
                </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {services.map((service) => (
        <div 
          key={service.id}
          className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary/50 transition-all cursor-pointer relative"
          onClick={() => onViewDetails(service.id)}
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded bg-muted/30 border">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-bold">{service.service_name}</h4>
              <p className="text-xs text-muted-foreground font-mono">{service.service_url}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Badge variant="secondary" className="text-[10px]">{service.service_category}</Badge>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); }}><Settings className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); }}><ExternalLink className="w-4 h-4" /></Button>
              {onDelete && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                            onClick={(e) => { e.stopPropagation(); }}
                        >
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                            variant="destructive"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(service.id);
                            }}
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
