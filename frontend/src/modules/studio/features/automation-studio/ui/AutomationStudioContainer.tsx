"use client";

import { useAutomation, useCreateAutomation, useUpdateAutomation } from "@/modules/resources/application/useAutomations";
import { AutomationStudio } from "./AutomationStudio";
import { useRouter } from "next/navigation";
import { AutomationFormData } from "../types/automation-schema";
import { useMemo } from "react";
import { toast } from "sonner";

interface Props {
	workspaceId: string;
	automationId?: string;
}

export const AutomationStudioContainer = ({ workspaceId, automationId }: Props) => {
	const router = useRouter();
	const { data: automation, isLoading, isError } = useAutomation(automationId as string);
	const { mutateAsync: createAutomation } = useCreateAutomation();
	const { mutateAsync: updateAutomation } = useUpdateAutomation();

	const initialData = useMemo(() => {
		if (!automationId || !automation) return undefined;
		return {
			definition: {
				semanticDescription: automation.description || "",
				keywords: automation.keywords || [],
			},
			connection: {
				platform: "n8n", // Default or extract from automation
				method: "POST",
				url: automation.webhook_url || "",
				auth: { type: "header" },
			},
			dataInterface: {
				context: [],
				artefacts: [],
			},
			availability: [],
		} as Partial<AutomationFormData>;
	}, [automationId, automation]);

	const handleSave = async (data: AutomationFormData) => {
		try {
			const apiData = {
				name: data.definition.semanticDescription.slice(0, 50),
				description: data.definition.semanticDescription,
				keywords: data.definition.keywords,
				webhook_url: data.connection.url,
				workspace_id: workspaceId,
			};

			if (automationId) {
				await updateAutomation({ id: automationId, data: apiData });
				toast.success("Zaktualizowano automatyzację");
			} else {
				await createAutomation(apiData);
				toast.success("Utworzono automatyzację");
			}
			router.push(`/workspaces/${workspaceId}/automations`);
		} catch (error: any) {
			toast.error(`Błąd: ${error.message}`);
		}
	};

	const handleCancel = () => {
		router.push(`/workspaces/${workspaceId}/automations`);
	};

	if (automationId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	if (automationId && isError) {
		return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania.</div>;
	}

	return (
		<AutomationStudio 
			onSave={handleSave} 
			onCancel={handleCancel} 
			initialData={initialData}
			isEditing={!!automationId}
		/>
	);
};
