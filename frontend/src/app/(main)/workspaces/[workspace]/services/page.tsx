"use client";

import { useParams } from "next/navigation";
import { useServices, useWorkspace } from "@/modules/workspaces/application/useWorkspaces";
import { PageLayout } from "@/shared/ui/layout/PageLayout";
import { ActionButton } from "@/shared/ui/complex/ActionButton";
import { ServicesBrowser } from "@/modules/workspaces/features/browse-services/ui/ServicesBrowser";
import { MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS } from "@/modules/spaces/domain/constants";
import { Plus } from "lucide-react";
import { Skeleton } from "@/shared/ui/ui/Skeleton";
import { useRouter } from "next/navigation";

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

  const colorKey = workspaceId.replace("ws-", "");
  const colorName = MAP_OF_WORKSPACE_IDENTIFIERS_TO_COLORS[colorKey] || "default";

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
      {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pt-4">
              {[1, 2, 3].map((index) => <Skeleton key={index} className="h-32 w-full rounded-xl shadow-sm" />)}
          </div>
      ) : (
          <ServicesBrowser initialServices={services || []} colorName={colorName} />
      )}
    </PageLayout>
  );
};

export default ServicesListPage;
