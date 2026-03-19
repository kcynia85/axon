"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useArchetypeDraft } from "./useArchetypeDraft";
import {
	archetypeSchema,
	type ArchetypeFormValues,
} from "./archetypeSchema";
import { usePromptArchetype, useCreatePromptArchetype, useUpdatePromptArchetype } from "@/modules/resources/application/usePromptArchetypes";
import { toast } from "sonner";

/**
 * useArchetypeStudio handles the full-screen archetype design logic.
 * Decoupled from Workspaces, as Archetypes are global Resources.
 */
export const useArchetypeStudio = (archetypeId?: string | null) => {
	const params = useParams();
	const workspaceId = params?.workspace as string;
	const router = useRouter();

	const isRealId = !!archetypeId && archetypeId !== "draft";

	const { data: archetype, isLoading: isArchetypeLoading } = usePromptArchetype(isRealId ? (archetypeId as string) : "");
	const { draft, saveDraft, clearDraft, isLoading: isDraftLoading } = useArchetypeDraft(workspaceId || "global", archetypeId || "new");
	const { mutateAsync: createArchetype, isPending: isCreating } = useCreatePromptArchetype();
	const { mutateAsync: updateArchetype, isPending: isUpdating } = useUpdatePromptArchetype();

	const initialData = useMemo(() => {
		if (!isRealId || !archetype) return undefined;

		return {
			name: archetype.archetype_name || "",
			description: archetype.archetype_description || "",
			role: archetype.archetype_role || "",
			goal: archetype.archetype_goal || "",
			backstory: archetype.archetype_backstory || "",
			keywords: archetype.archetype_keywords || [],
			knowledgeHubIds: (archetype.archetype_knowledge_hubs || []).map((hub: { id?: string } | string) => typeof hub === "string" ? hub : (hub?.id || "")),
			instructions: archetype.archetype_guardrails?.instructions || [],
			constraints: archetype.archetype_guardrails?.constraints || [],
			workspaceIds: ["Global Availability"],
		} as Partial<ArchetypeFormValues>;
	}, [isRealId, archetype]);

	const form = useForm<ArchetypeFormValues>({
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		resolver: zodResolver(archetypeSchema) as any,
		values: initialData || draft || {
			name: "",
			description: "",
			role: "",
			goal: "",
			backstory: "",
			keywords: [],
			knowledgeHubIds: [],
			instructions: [],
			constraints: [],
			workspaceIds: ["Global Availability"],
		},
	});

	const handleExit = useCallback(() => {
		router.push("/resources/archetypes");
	}, [router]);

	const handleSubmit = async (data: ArchetypeFormValues) => {
		try {
			const apiData: Record<string, unknown> = {
				archetype_name: data.name,
				archetype_description: data.description,
				archetype_role: data.role,
				archetype_goal: data.goal,
				archetype_backstory: data.backstory,
				archetype_guardrails: {
					instructions: data.instructions,
					constraints: data.constraints,
				},
				archetype_knowledge_hubs: data.knowledgeHubIds.map(id => ({ id })),
				archetype_keywords: data.keywords,
				workspace_domain: workspaceId || "General",
			};

			if (isRealId) {
				await updateArchetype({ id: archetypeId as string, archetype: apiData });
				toast.success("Archetyp zaktualizowany pomyślnie");
			} else {
				await createArchetype(apiData);
				toast.success("Archetyp utworzony pomyślnie");
			}
			
			clearDraft();
			handleExit();
		} catch (error: unknown) {
			const errorMessage = error instanceof Error ? error.message : "Nieznany błąd";
			toast.error(`Wystąpił błąd: ${errorMessage}`);
		}
	};

	const syncDraft = useCallback(() => {
		setTimeout(() => {
			saveDraft(form.getValues());
		}, 0);
	}, [form, saveDraft]);

	return {
		form,
		isLoading: (isRealId && isArchetypeLoading) || isDraftLoading,
		isSaving: isCreating || isUpdating,
		handleExit,
		handleSubmit,
		syncDraft,
		workspaceId,
	};
};
