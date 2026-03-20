import { ServiceStudioContainer } from "@/modules/studio/features/service-studio/ui/ServiceStudioContainer";

export default async function NewServiceStudioPage({ params }: { params: Promise<{ workspace: string }> }) {
  const { workspace } = await params;
  return <ServiceStudioContainer workspaceId={workspace} />;
}
