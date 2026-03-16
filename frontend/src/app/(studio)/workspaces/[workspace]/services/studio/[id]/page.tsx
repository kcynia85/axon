import { ServiceStudioContainer } from "@/modules/studio/features/service-studio/ui/ServiceStudioContainer";

export default async function EditServiceStudioPage({ params }: { params: Promise<{ workspace: string; id: string }> }) {
  const { workspace, id } = await params;
  return <ServiceStudioContainer workspaceId={workspace} serviceId={id} />;
}
