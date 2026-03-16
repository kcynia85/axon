"use client";

import { useParams, useRouter } from "next/navigation";
import { useServices } from "@/modules/workspaces/application/useServices";
import { useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { BrowserLayout } from "@/shared/ui/layout/BrowserLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { Globe, Activity, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/shared/ui/ui/Card";
import { Badge } from "@/shared/ui/ui/Badge";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { cn } from "@/shared/lib/utils";
import { getVisualStylesForZoneColor } from "@/modules/spaces/ui/utils/presentation_mappers";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { useState } from "react";

const COLOR_TO_RGB: Record<string, string> = {
    blue: "59, 130, 246",
    purple: "168, 85, 247",
    pink: "236, 72, 153",
    green: "34, 197, 94",
    yellow: "234, 179, 8",
    orange: "249, 115, 22",
    default: "113, 113, 122"
};

/**
 * ServicesListPage: Lists all available service definitions.
 * Standard: 0% useEffect, arrow function.
 */
const ServicesListPage = () => {
  const params = useParams();
  const router = useRouter();
  const workspaceId = params.workspace as string;
  
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: services, isLoading } = useServices(workspaceId);
  const [searchQuery, setSearchQuery] = useState("");

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";
  const styles = getVisualStylesForZoneColor(colorName);
  const rgb = COLOR_TO_RGB[colorName] || COLOR_TO_RGB.default;

  const filteredServices = services?.filter(service => 
    service.service_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.service_category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const goToServiceStudio = () => {
    router.push(`/workspaces/${workspaceId}/services/studio`);
  };

  return (
    <PageLayout
      title="Services" 
      description={`External services available in ${workspace?.name || 'workspace'}.`}
      breadcrumbs={[
          { label: "Workspaces", href: "/workspaces" },
          { label: workspace?.name || "...", href: `/workspaces/${workspaceId}` },
          { label: "Services" }
      ]}
      actions={
        <ActionButton 
            label="Nowa Usługa" 
            icon={Plus}
            onClick={goToServiceStudio} 
        />
      }
      showPagination={false}
    >
      <BrowserLayout
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search services..."
      >
        {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl shadow-sm" />)}
            </div>
        ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
                {filteredServices?.map((service) => (
                    <Card 
                        key={service.id} 
                        onClick={() => router.push(`/workspaces/${workspaceId}/services/studio/${service.id}`)}
                        className={cn(
                            "relative overflow-hidden cursor-pointer flex flex-col pt-2 transition-all duration-200 rounded-xl",
                        "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950",
                        "hover:shadow-md",
                        `hover:${styles.borderClassName}`
                    )}>
                        {/* Accent Top Bar */}
                        <div 
                            className={cn("absolute top-0 left-0 right-0 h-[2px] opacity-40 transition-opacity duration-200 group-hover:opacity-100 z-10", styles.hoverBackgroundClassName)} 
                        />

                        {/* Background Grid Pattern */}
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0" 
                            style={{ backgroundImage: `radial-gradient(rgb(${rgb}) 0.5px, transparent 0.5px)`, backgroundSize: '12px 12px' }} 
                        />

                        <CardHeader className="relative z-10 space-y-3 pb-3 pt-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 rounded bg-muted/30">
                                        <Globe className="h-4 w-4 text-zinc-500" />
                                    </div>
                                    <CardTitle className="text-sm font-bold font-display group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">{service.service_name}</CardTitle>
                                </div>
                                <Badge 
                                    variant="outline" 
                                    className={cn("text-[9px] h-4 py-0 uppercase font-bold tracking-tighter border-none bg-muted/30")}
                                >
                                    {service.service_category}
                                </Badge>
                            </div>
                            <CardDescription className="text-[11px] mt-1 line-clamp-2 leading-relaxed">
                                {service.service_description || `Integration with ${service.service_category} platform.`}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="relative z-10 mt-auto pt-0 pb-4">
                            <div className="flex items-center gap-2">
                                <Activity className="h-3 w-3 text-muted-foreground opacity-40" />
                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest opacity-60">Connected</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
      </BrowserLayout>
    </PageLayout>
  );
};

export default ServicesListPage;
