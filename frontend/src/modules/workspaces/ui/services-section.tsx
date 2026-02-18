"use client";

import { useServices } from "../application/use-workspaces";
import { Card, CardHeader, CardTitle, CardDescription } from "@/shared/ui/ui/card";
import { Skeleton } from "@/shared/ui/ui/skeleton";
import { Badge } from "@/shared/ui/ui/badge";
import { Globe } from "lucide-react";
import Link from "next/link";

interface ServicesSectionProps {
  workspaceId: string;
}

export const ServicesSection = ({ workspaceId }: ServicesSectionProps) => {
  const { data: services, isLoading } = useServices(workspaceId);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
    );
  }

  if (!services || services.length === 0) {
    return <div className="p-4 border rounded-md text-muted-foreground text-sm">No services registered yet.</div>;
  }

  const previewServices = services.slice(0, 3);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {previewServices.map((service) => (
        <Link key={service.id} href={`/workspaces/${workspaceId}/services/${service.id}`}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-primary" />
                        <CardTitle className="text-sm font-semibold truncate">{service.name}</CardTitle>
                    </div>
                </div>
                <CardDescription className="text-[10px] mt-1 truncate">{service.url}</CardDescription>
            </CardHeader>
            </Card>
        </Link>
      ))}
    </div>
  );
};
