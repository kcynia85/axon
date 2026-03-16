"use client";

import { useAutomation, useCreateAutomation, useUpdateAutomation } from "@/modules/workspaces/application/useAutomations";
import { AutomationStudio } from "./AutomationStudio";
import { useRouter } from "next/navigation";
import { AutomationFormData } from "../types/automation-schema";
import { useMemo } from "react";
import { toast } from "sonner";

interface Props {
	workspaceId: string;
	automationId?: string;
}

/**
 * AutomationStudioContainer: Handles data orchestration for automation design.
 * Standard: 0% useEffect, arrow function.
 */
export const AutomationStudioContainer = ({ workspaceId, automationId }: Props) => {
	const router = useRouter();
	const { data: automation, isLoading, isError } = useAutomation(workspaceId, automationId as string);
	const { mutateAsync: createAutomation } = useCreateAutomation(workspaceId);
	const { mutateAsync: updateAutomation } = useUpdateAutomation(workspaceId);

	const initialData = useMemo(() => {
		if (!automationId || !automation) return undefined;
		return {
			definition: {
				name: automation.automation_name || "",
				semanticDescription: automation.automation_description || "",
				keywords: automation.automation_keywords || [],
			},
			connection: {
				platform: automation.automation_platform || "n8n",
				method: automation.automation_http_method || "POST",
				url: automation.automation_webhook_url || "",
				auth: { type: "header" },
			},
			dataInterface: {
				context: [],
				artefacts: [],
			},
			availability: automation.availability_workspace || [],
		} as Partial<AutomationFormData>;
	}, [automationId, automation]);

	const handleSave = async (data: AutomationFormData) => {
		try {
			const apiData: any = {
				automation_name: data.definition.name,
				automation_description: data.definition.semanticDescription,
				automation_keywords: data.definition.keywords,
				automation_webhook_url: data.connection.url,
				automation_platform: data.connection.platform,
				automation_http_method: data.connection.method,
				availability_workspace: data.availability.length > 0 ? data.availability : [workspaceId],
			};

			if (automationId) {
				await updateAutomation({ automationId, automation: apiData });
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
