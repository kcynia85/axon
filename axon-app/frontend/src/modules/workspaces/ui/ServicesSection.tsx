"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useServices, useDeleteService } from "../application/useServices";
import { useServiceDraft } from "@/modules/studio/features/service-studio/application/hooks/useServiceDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Card } from "@/shared/ui/ui/Card";
import { Button } from "@/shared/ui/ui/Button";
import { Cloud, Plus } from "lucide-react";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { toast } from "sonner";
import { ServiceProfilePeek } from "./ServiceSidePeek";
import { useDeleteWithUndo } from "@/shared/hooks/useDeleteWithUndo";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";

import { ExternalService } from "@/shared/domain/resources";

type ServicesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const ServicesSection = ({ workspaceId, colorName = "default" }: ServicesSectionProps) => {
  const router = useRouter();
  const { data: services, isLoading } = useServices(workspaceId);
  const { clearDraft } = useServiceDraft(workspaceId);
  const { mutate: deleteService } = useDeleteService(workspaceId);
  const { deleteWithUndo } = useDeleteWithUndo();
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (serviceId: string) => {
    if (serviceId === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic usługi usunięty");
      }
      return;
    }
    
    setServiceToDeleteId(serviceId);
  };

  const confirmDelete = () => {
    if (!serviceToDeleteId) return;
    
    const service = (services as readonly ExternalService[] | undefined)?.find(serviceItem => serviceItem.id === serviceToDeleteId);
    const serviceName = service?.service_name || "Service";
    deleteWithUndo(serviceToDeleteId, serviceName, () => deleteService(serviceToDeleteId));
    setServiceToDeleteId(null);
  };

  const selectedService = (services as readonly ExternalService[] | undefined)?.find(serviceItem => serviceItem.id === selectedServiceId) || null;

  const handleEdit = (serviceId: string) => {
    router.push(`/workspaces/${workspaceId}/services/studio/${serviceId}`);
  };

  const displayServices = React.useMemo(() => {
    if (!services) return [];
    return (services as readonly ExternalService[]).slice(0, 3);
  }, [services]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Card className="border-dashed h-40 flex flex-col items-center justify-center px-8 text-muted-foreground text-sm italic rounded-xl bg-muted/5 gap-4">
        <span>No services found. Add an integration.</span>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => router.push(`/workspaces/${workspaceId}/services/studio`)}
          className="gap-2 font-semibold"
        >
          <Plus className="w-4 h-4" /> Add Service
        </Button>
      </Card>
    );
  }

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayServices.map((service) => (
          <WorkspaceCardHorizontal 
            key={service.id}
            title={service.service_name}
            description={service.service_description || `Integration with ${service.service_category} platform.`}
            href="#"
            icon={Cloud}
            resourceId={service.id}
            onEdit={() => {
              handleEdit(service.id);
            }}
            onClick={() => setSelectedServiceId(service.id)}
            onDelete={handleDelete}
            colorName={colorName}
          />
        ))}
      </div>

      <ServiceProfilePeek 
        key={selectedServiceId || "none"}
        service={selectedService}
        isOpen={!!selectedServiceId}
        onClose={() => setSelectedServiceId(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DestructiveDeleteModal
        isOpen={!!serviceToDeleteId}
        onClose={() => setServiceToDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete Service"
        resourceName={(services as readonly ExternalService[] | undefined)?.find(serviceItem => serviceItem.id === serviceToDeleteId)?.service_name || "Service"}
        affectedResources={[]}
      />
    </>
  );
};
