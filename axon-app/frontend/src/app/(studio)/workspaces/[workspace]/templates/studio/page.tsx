import { TemplateStudioContainer } from "@/modules/studio/features/template-studio/ui/TemplateStudioContainer";

interface Props {
	params: Promise<{ workspace: string }>;
	searchParams: Promise<{ id?: string }>;
}

/**
 * TemplateStudioPage: Server component entry point for the Template Studio.
 * Awaits params and renders the client-side container.
 */
export default async function TemplateStudioPage({ params, searchParams }: Props) {
	const { workspace } = await params;
	const { id } = await searchParams;

	return (
		<TemplateStudioContainer 
			workspaceId={workspace} 
			templateId={id} 
		/>
	);
}
