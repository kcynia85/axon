import { redirect } from "next/navigation";

type PageProps = {
    readonly params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: PageProps) {
    const { id } = await params;
    redirect(`/projects/studio/${id}`);
}
