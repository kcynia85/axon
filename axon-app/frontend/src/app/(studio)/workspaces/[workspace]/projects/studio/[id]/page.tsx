import { ProjectStudioContainer } from "@/modules/studio/features/project-studio/ui/ProjectStudioContainer";

export default async function EditProjectStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProjectStudioContainer projectId={id} />;
}
