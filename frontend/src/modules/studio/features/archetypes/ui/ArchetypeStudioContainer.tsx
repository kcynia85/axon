"use client";

import { usePromptArchetype } from "@/modules/resources/application/usePromptArchetypes";
import { ArchetypeStudio } from "./ArchetypeStudio";
import { useMemo } from "react";
import type { ArchetypeFormValues } from "../application/archetypeSchema";

interface Props {
	archetypeId: string;
}

export const ArchetypeStudioContainer = ({ archetypeId }: Props) => {
	const { data: archetype, isLoading, isError } = usePromptArchetype(archetypeId);

	const initialData = useMemo(() => {
		if (!archetype) return undefined;
		return {
			name: archetype.archetype_name || "",
			description: archetype.archetype_description || "",
			role: archetype.archetype_role || "",
			goal: archetype.archetype_goal || "",
			backstory: archetype.archetype_backstory || "",
			keywords: archetype.archetype_keywords || [],
			knowledgeHubIds: [], // To be mapped if available in DTO
			instructions: archetype.archetype_guardrails?.instructions || [],
			constraints: archetype.archetype_guardrails?.constraints || [],
			workspaceIds: ["Global Availability"],
		} as Partial<ArchetypeFormValues>;
	}, [archetype]);

	if (isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	if (isError || !archetype) {
		return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania archetypu.</div>;
	}

	return <ArchetypeStudio initialData={initialData} archetypeId={archetypeId} />;
};
