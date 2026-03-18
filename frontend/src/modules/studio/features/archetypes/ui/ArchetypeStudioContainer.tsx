"use client";

import { useArchetypeStudio } from "../application/useArchetypeStudio";
import { ArchetypeStudio } from "./ArchetypeStudio";

interface Props {
	workspaceId?: string;
	archetypeId?: string;
}

/**
 * ArchetypeStudioContainer: Handles data orchestration for archetype design.
 * Standard: 0% useEffect, arrow function.
 */
export const ArchetypeStudioContainer = ({ archetypeId }: Props) => {
	const {
		form,
		isLoading,
		isSaving,
		handleExit,
		handleSubmit,
		syncDraft,
	} = useArchetypeStudio(archetypeId);

	if (archetypeId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	return (
		<ArchetypeStudio 
			onSave={handleSubmit} 
			onCancel={handleExit} 
			form={form}
			archetypeId={archetypeId}
			isSaving={isSaving}
			syncDraft={syncDraft}
		/>
	);
};
