"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useAutomationDraft } from "./useAutomationDraft";
import {
	automationFormSchema,
	type AutomationFormData,
} from "../types/automation-schema";
import { useAutomation, useCreateAutomation, useUpdateAutomation } from "@/modules/workspaces/application/useAutomations";
import { toast } from "sonner";

/**
 * useAutomationStudio handles the full-screen automation design logic.
 * Standard: 0% useEffect, consistent with Agent, Crew and Template modules.
 */
export const useAutomationStudio = (automationId?: string | null) => {
	const { workspace: workspaceId } = useParams<{ workspace: string }>();
	const router = useRouter();

	const { data: automation, isLoading: isAutomationLoading } = useAutomation(workspaceId, automationId as string);
	const { draft, saveDraft, clearDraft, isLoading: isDraftLoading } = useAutomationDraft(workspaceId, automationId);
	const { mutateAsync: createAutomation, isPending: isCreating } = useCreateAutomation(workspaceId);
	const { mutateAsync: updateAutomation, isPending: isUpdating } = useUpdateAutomation(workspaceId);

	const getInitialData = () => {
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
				context: Object.entries(automation.automation_input_schema || {}).map(([name, config]) => ({
					name,
					field_type: (config as any).field_type || String(config),
					is_required: (config as any).is_required || false,
				})),
				artefacts: Object.entries(automation.automation_output_schema || {}).map(([name, config]) => ({
					name,
					field_type: (config as any).field_type || String(config),
					is_required: (config as any).is_required || false,
				})),
			},
			availability: automation.availability_workspace || [workspaceId],
		} as Partial<AutomationFormData>;
	};

	const initialData = getInitialData();

	const form = useForm<AutomationFormData>({
		resolver: zodResolver(automationFormSchema) as any,
		values: initialData || draft || {
			definition: {
				name: "",
				semanticDescription: "",
				keywords: [],
			},
			connection: {
				platform: "n8n",
				method: "POST",
				url: "",
				auth: { type: "none" },
			},
			dataInterface: {
				context: [],
				artefacts: [],
			},
			availability: [workspaceId],
		},
	});

	const handleExit = () => {
		router.push(`/workspaces/${workspaceId}/automations`);
	};

	const handleSubmit = async (data: AutomationFormData) => {
		try {
			const apiData: any = {
				automation_name: data.definition.name,
				automation_description: data.definition.semanticDescription,
				automation_keywords: data.definition.keywords,
				automation_webhook_url: data.connection.url,
				automation_platform: data.connection.platform,
				automation_http_method: data.connection.method,
				availability_workspace: data.availability,
				automation_input_schema: data.dataInterface.context.reduce((accumulator, currentField) => ({
					...accumulator,
					[currentField.name]: { field_type: currentField.field_type, is_required: currentField.is_required },
				}), {}),
				automation_output_schema: data.dataInterface.artefacts.reduce((accumulator, currentField) => ({
					...accumulator,
					[currentField.name]: { field_type: currentField.field_type, is_required: currentField.is_required },
				}), {}),
			};

			if (automationId) {
				await updateAutomation({ automationId, automation: apiData });
				toast.success("Automatyzacja zaktualizowana pomyślnie");
			} else {
				await createAutomation(apiData);
				toast.success("Automatyzacja utworzona pomyślnie");
			}
			
			clearDraft();
			handleExit();
		} catch (error: any) {
			toast.error(`Wystąpił błąd: ${error.message || "Nieznany błąd"}`);
		}
	};

	const syncDraft = () => {
		saveDraft(form.getValues());
	};

	return {
		form,
		isLoading: (!!automationId && isAutomationLoading) || isDraftLoading,
		isSaving: isCreating || isUpdating,
		handleExit,
		handleSubmit,
		syncDraft,
		workspaceId,
	};
};
