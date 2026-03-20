"use client";

import { TemplateStudio } from "./TemplateStudio";
import { useTemplateStudio } from "../application/hooks/useTemplateStudio";
import { Skeleton } from "@/shared/ui/ui/Skeleton";

interface Props {
	workspaceId: string;
	templateId?: string | null;
}

/**
 * TemplateStudioContainer: Handles client-side state and data fetching for the studio.
 * Standard: 0% useEffect, consistent with Agent and Crew modules.
 */
export const TemplateStudioContainer = ({ templateId }: Props) => {
	const { 
		form, 
		isLoading, 
		isSaving, 
		handleExit, 
		handleSubmit, 
		syncDraft,
		workspaceId 
	} = useTemplateStudio(templateId);

	if (isLoading) {
		return (
			<div className="p-12 space-y-12 bg-black min-h-screen">
				<Skeleton className="h-24 w-full rounded-2xl bg-zinc-900" />
				<Skeleton className="h-[400px] w-full rounded-3xl bg-zinc-900/50" />
			</div>
		);
	}

	return (
		<TemplateStudio
			workspaceId={workspaceId}
			templateId={templateId}
			form={form}
			onSave={handleSubmit}
			onCancel={handleExit}
			onSyncDraft={syncDraft}
			isSaving={isSaving}
			isEditing={!!templateId}
		/>
	);
};
