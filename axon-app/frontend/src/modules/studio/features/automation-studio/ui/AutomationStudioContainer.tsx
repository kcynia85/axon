"use client";

import { useAutomationStudio } from "../application/useAutomationStudio";
import { AutomationStudio } from "./AutomationStudio";

interface Props {
	workspaceId: string;
	automationId?: string;
}

/**
 * AutomationStudioContainer: Handles data orchestration for automation design.
 * Standard: 0% useEffect, arrow function.
 */
export const AutomationStudioContainer = ({ workspaceId, automationId }: Props) => {
	const {
		form,
		isLoading,
		isSaving,
		handleExit,
		handleSubmit,
		syncDraft,
	} = useAutomationStudio(automationId);

	if (automationId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	return (
		<AutomationStudio 
			onSave={handleSubmit} 
			onCancel={handleExit} 
			form={form}
			isEditing={!!automationId}
			isSaving={isSaving}
			syncDraft={syncDraft}
		/>
	);
};
