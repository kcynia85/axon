"use client";

import { TemplateStudio } from "./TemplateStudio";
import { useRouter } from "next/navigation";
import type { TemplateStudioFormData } from "../types/template-studio.types";
import { useTemplate, useCreateTemplate, useUpdateTemplate } from "@/modules/workspaces/application/useTemplates";
import { useMemo } from "react";
import { toast } from "sonner";

interface Props {
	workspaceId: string;
	templateId?: string | null;
}

/**
 * TemplateStudioContainer: Handles client-side state and data fetching for the studio.
 */
export const TemplateStudioContainer = ({ workspaceId, templateId }: Props) => {
	const router = useRouter();
	
	const { data: template, isLoading, isError } = useTemplate(workspaceId, templateId as string);
	const { mutateAsync: createTemplate } = useCreateTemplate(workspaceId);
	const { mutateAsync: updateTemplate } = useUpdateTemplate(workspaceId);
	
	const initialData = useMemo(() => {
		if (!templateId || !template) return undefined;

		return {
			name: template.template_name || "",
			goal: template.template_goal || template.template_name || "",
			description: template.template_description || "",
			keywords: template.template_keywords || [],
			markdown: template.template_markdown_content || "",
			context_items: template.template_inputs?.map(i => ({
				name: i.label,
				field_type: i.expectedType as any,
				is_required: true
			})) || [],
			artefact_items: template.template_outputs?.map(o => ({
				name: o.label,
				field_type: (o.outputType as any) || "file",
				is_required: true
			})) || [],
			availability_workspace: template.availability_workspace || [workspaceId],
		} as Partial<TemplateStudioFormData>;
	}, [templateId, template, workspaceId]);

	const handleSave = async (data: TemplateStudioFormData) => {
		try {
			const apiData = {
				template_name: data.name,
				template_goal: data.goal,
				template_description: data.description,
				template_keywords: data.keywords,
				template_markdown_content: data.markdown,
				availability_workspace: data.availability_workspace,
				template_inputs: data.context_items.map(i => ({
					label: i.name,
					expectedType: i.field_type,
				})),
				template_outputs: data.artefact_items.map(o => ({
					label: o.name,
					outputType: o.field_type,
				})),
			};

			if (templateId) {
				await updateTemplate({ templateId, template: apiData });
				toast.success("Szablon zaktualizowany pomyślnie");
			} else {
				await createTemplate(apiData);
				toast.success("Szablon utworzony pomyślnie");
			}
			router.push(`/workspaces/${workspaceId}/templates`);
		} catch (error: any) {
			toast.error(`Wystąpił błąd: ${error.message || "Nieznany błąd"}`);
		}
	};

	const handleCancel = () => {
		router.push(`/workspaces/${workspaceId}/templates`);
	};

	if (templateId && isLoading) {
		return <div className="flex h-screen w-full items-center justify-center text-zinc-500 font-mono text-sm tracking-widest uppercase">Ładowanie...</div>;
	}

	if (templateId && isError) {
		return <div className="flex h-screen w-full items-center justify-center text-red-500 font-mono text-sm tracking-widest uppercase">Błąd podczas ładowania szablonu.</div>;
	}

	return (
		<TemplateStudio
			onSave={handleSave}
			onCancel={handleCancel}
			initialData={initialData}
			isEditing={!!templateId}
		/>
	);
};
