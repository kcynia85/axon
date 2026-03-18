"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTemplateDraft } from "./useTemplateDraft";
import {
	TemplateStudioSchema,
	type TemplateStudioFormData,
} from "../../types/template-studio.types";
import { useTemplate, useCreateTemplate, useUpdateTemplate } from "@/modules/workspaces/application/useTemplates";
import { parseMarkdownToChecklist } from "../utils/markdown-parser";
import { toast } from "sonner";

/**
 * useTemplateStudio handles the full-screen template design logic.
 * Standard: 0% useEffect, consistent with Agent and Crew modules.
 */
export const useTemplateStudio = (templateId?: string | null) => {
	const { workspace: workspaceId } = useParams<{ workspace: string }>();
	const router = useRouter();

	const { data: template, isLoading: isTemplateLoading } = useTemplate(workspaceId, templateId as string);
	const { draft, saveDraft, clearDraft, isLoading: isDraftLoading } = useTemplateDraft(workspaceId, templateId);
	const { mutateAsync: createTemplate, isPending: isCreating } = useCreateTemplate(workspaceId);
	const { mutateAsync: updateTemplate, isPending: isUpdating } = useUpdateTemplate(workspaceId);

	const initialData = useMemo(() => {
		if (!templateId || !template) return undefined;

		return {
			name: template.template_name || "",
			description: template.template_description || "",
			keywords: template.template_keywords || [],
			markdown: template.template_markdown_content || "",
			context_items: template.template_inputs?.map(i => ({
				id: i.id,
				name: i.label,
				field_type: i.expectedType as any,
				is_required: i.isRequired ?? true
			})) || [],
			artefact_items: template.template_outputs?.map(o => ({
				id: o.id,
				name: o.label,
				field_type: (o.outputType as any) || "file",
				is_required: o.isRequired ?? true
			})) || [],
			availability_workspace: template.availability_workspace || [workspaceId],
		} as Partial<TemplateStudioFormData>;
	}, [templateId, template, workspaceId]);

	const form = useForm<TemplateStudioFormData>({
		resolver: zodResolver(TemplateStudioSchema) as any,
		values: initialData || draft || {
			name: "",
			description: "",
			keywords: [],
			markdown: "",
			context_items: [],
			artefact_items: [],
			availability_workspace: [workspaceId],
		},
	});

	const handleExit = useCallback(() => {
		router.push(`/workspaces/${workspaceId}/templates`);
	}, [router, workspaceId]);

	const handleSubmit = async (data: TemplateStudioFormData) => {
		try {
			const derivedChecklist = parseMarkdownToChecklist(data.markdown);

			const apiData: any = {
				template_name: data.name,
				template_description: data.description,
				template_keywords: data.keywords,
				template_markdown_content: data.markdown,
				availability_workspace: data.availability_workspace,
				template_checklist_items: derivedChecklist,
				template_inputs: data.context_items.map(i => ({
					id: (i as any).id || crypto.randomUUID(),
					label: i.name,
					expectedType: i.field_type,
					isRequired: i.is_required
				})),
				template_outputs: data.artefact_items.map(o => ({
					id: (o as any).id || crypto.randomUUID(),
					label: o.name,
					outputType: o.field_type,
					isRequired: o.is_required
				})),
			};

			if (templateId) {
				await updateTemplate({ templateId, template: apiData });
				toast.success("Szablon zaktualizowany pomyślnie");
			} else {
				await createTemplate(apiData);
				toast.success("Szablon utworzony pomyślnie");
			}
			
			clearDraft();
			handleExit();
		} catch (error: any) {
			toast.error(`Wystąpił błąd: ${error.message || "Nieznany błąd"}`);
		}
	};

	// Manual trigger for UI (e.g. onBlur of critical fields)
	const syncDraft = useCallback(() => {
		saveDraft(form.getValues());
	}, [form, saveDraft]);

	return {
		form,
		isLoading: (!!templateId && isTemplateLoading) || isDraftLoading,
		isSaving: isCreating || isUpdating,
		handleExit,
		handleSubmit,
		syncDraft,
		workspaceId,
	};
};
