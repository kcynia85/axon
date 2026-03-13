import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
	archetypeSchema,
	type ArchetypeFormValues,
} from "./archetypeSchema";
import { useCreatePromptArchetype, useUpdatePromptArchetype } from "@/modules/resources/application/usePromptArchetypes";
import { toast } from "sonner";

export type ArchetypeStudioSectionId = "IDENTITY" | "MEMORY" | "ACCESS";

export const useArchetypeStudioView = (initialData?: Partial<ArchetypeFormValues>, archetypeId?: string) => {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState<ArchetypeStudioSectionId>("IDENTITY");

	const { mutateAsync: createArchetype, isPending: isCreating } = useCreatePromptArchetype();
	const { mutateAsync: updateArchetype, isPending: isUpdating } = useUpdatePromptArchetype();

	const form = useForm<ArchetypeFormValues>({
		resolver: zodResolver(archetypeSchema),
		defaultValues: {
			name: "",
			description: "",
			role: "",
			goal: "",
			backstory: "",
			keywords: [],
			knowledgeHubIds: [],
			instructions: [],
			constraints: [],
			isGlobalAccess: true,
			workspaceIds: [],
			...initialData,
		},
	});

	const handleSubmit = async (data: ArchetypeFormValues) => {
		try {
			// Map ArchetypeFormValues to the API structure (PromptArchetype)
			const apiData = {
				archetype_name: data.name,
				archetype_description: data.description,
				archetype_role: data.role,
				archetype_goal: data.goal,
				archetype_backstory: data.backstory,
				archetype_guardrails: {
					instructions: data.instructions,
					constraints: data.constraints,
				},
				archetype_keywords: data.keywords,
				// workspace_domain: data.isGlobalAccess ? "General" : "Custom", // example logic
			};

			if (archetypeId) {
				await updateArchetype({ id: archetypeId, archetype: apiData });
				toast.success("Archetyp zaktualizowany pomyślnie");
			} else {
				await createArchetype(apiData);
				toast.success("Archetyp utworzony pomyślnie");
			}
			router.back();
		} catch (error: any) {
			toast.error(`Błąd: ${error.message || "Nieznany błąd"}`);
		}
	};

	const handleExit = () => {
		router.back();
	};

	const scrollToSection = (id: ArchetypeStudioSectionId) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth", block: "start" });
			setActiveSection(id);
		}
	};

	const sections = [
		{ id: "IDENTITY" as const, title: "Tożsamość", number: 1 },
		{ id: "MEMORY" as const, title: "Pamięć i Rozumowanie", number: 2 },
		{ id: "ACCESS" as const, title: "Dostępność", number: 3 },
	];

	return {
		form,
		activeSection,
		scrollToSection,
		handleSubmit,
		handleExit,
		sections,
		isSaving: isCreating || isUpdating,
	};
};
