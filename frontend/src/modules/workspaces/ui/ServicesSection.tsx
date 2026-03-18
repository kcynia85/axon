"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useServices, useDeleteService } from "../application/useServices";
import { useServiceDraft } from "@/modules/studio/features/service-studio/application/hooks/useServiceDraft";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { Cloud } from "lucide-react";
import { Card } from "@/shared/ui/ui/Card";
import { WorkspaceCardHorizontal } from "@/shared/ui/complex/WorkspaceCardHorizontal";
import { toast } from "sonner";
import { DestructiveDeleteModal } from "@/shared/ui/modals/DestructiveDeleteModal";
import { ServiceProfilePeek } from "./ServiceProfilePeek";

type ServicesSectionProps = {
  readonly workspaceId: string;
  readonly colorName?: string;
};

export const ServicesSection = ({ workspaceId, colorName = "default" }: ServicesSectionProps) => {
  const router = useRouter();
  const { data: services, isLoading } = useServices(workspaceId);
  const { draft, clearDraft } = useServiceDraft(workspaceId);
  const { mutate: deleteService } = useDeleteService(workspaceId);
  const [selectedServiceId, setSelectedServiceId] = React.useState<string | null>(null);
  const [serviceToDeleteId, setServiceToDeleteId] = React.useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (id === "draft") {
      if (window.confirm("Are you sure you want to discard this draft?")) {
        clearDraft();
        toast.success("Szkic usługi usunięty");
      }
      return;
    }
    setServiceToDeleteId(id);
  };

  const confirmDelete = () => {
    if (serviceToDeleteId) {
      deleteService(serviceToDeleteId);
      setServiceToDeleteId(null);
      toast.success("Usługa usunięta");
    }
  };

  const selectedService = (services as any)?.find((s: any) => s.id === selectedServiceId);

  const handleEdit = (id: string) => {
    router.push(`/workspaces/${workspaceId}/services/studio/${id}`);
  };

  const displayServices = React.useMemo(() => {
    if (!services) return [];
    return (services as any).slice(0, 3);
  }, [services]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full shadow-sm rounded-xl" />)}
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayServices.map((service: any) => (
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
        resourceName={selectedService?.service_name || "this service"}
        affectedResources={[]}
      />
    </>
  );
};
