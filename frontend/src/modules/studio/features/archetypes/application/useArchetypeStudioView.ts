import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
	archetypeSchema,
	type ArchetypeFormValues,
} from "./archetypeSchema";

export type ArchetypeStudioSectionId = "IDENTITY" | "MEMORY" | "ACCESS";

export const useArchetypeStudioView = () => {
	const router = useRouter();
	const [activeSection, setActiveSection] = useState<ArchetypeStudioSectionId>("IDENTITY");

	const form = useForm<ArchetypeFormValues>({
		resolver: zodResolver(archetypeSchema),
		defaultValues: {
			role: "",
			goal: "",
			backstory: "",
			keywords: [],
			knowledgeHubIds: [],
			instructions: [],
			constraints: [],
			isGlobalAccess: true,
			workspaceIds: [],
		},
	});

	const handleSubmit = async (data: ArchetypeFormValues) => {
		// Replace with actual infrastructure call in the future
		console.log("Saving archetype draft:", data);
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
	};
};
