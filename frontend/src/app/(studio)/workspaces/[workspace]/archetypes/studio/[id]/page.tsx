import { ArchetypeStudioContainer } from "@/modules/studio/features/archetypes/ui/ArchetypeStudioContainer";

export default async function EditArchetypeStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ArchetypeStudioContainer archetypeId={id} />;
}
