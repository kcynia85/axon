"use client";

import { TemplateStudio } from "./TemplateStudio";
import { useRouter, useSearchParams } from "next/navigation";
import type { TemplateStudioFormData } from "../types/template-studio.types";
import { useTemplates } from "@/modules/workspaces/application/useTemplates";
import { useMemo } from "react";

interface Props {
	workspaceId: string;
	templateId?: string | null;
}

/**
 * TemplateStudioContainer: Handles client-side state and data fetching for the studio.
 */
export const TemplateStudioContainer = ({ workspaceId, templateId }: Props) => {
	const router = useRouter();
	const { data: templates } = useTemplates(workspaceId);
	
	const initialData = useMemo(() => {
		if (!templateId || !templates) return undefined;
		const template = templates.find(t => t.id === templateId);
		if (!template) return undefined;

		return {
			name: template.template_name || "",
			goal: template.template_goal || template.template_name || "",
			description: template.template_description || "",
			keywords: template.template_keywords || [],
			markdown: template.template_markdown_content || "",
			context_items: template.template_inputs?.map(i => ({
				name: i.label,
				field_type: i.expectedType,
				is_required: true
			})) || [],
			artefact_items: template.template_outputs?.map(o => ({
				name: o.label,
				field_type: o.outputType || "file",
				is_required: true
			})) || [],
			availability_workspace: template.availability_workspace || [workspaceId],
		} as Partial<TemplateStudioFormData>;
	}, [templateId, templates, workspaceId]);

	const handleSave = async (data: TemplateStudioFormData) => {
		console.log("Saving template in studio:", data);
		// TODO: Implement actual save/update mutation here
		router.push(`/workspaces/${workspaceId}/templates`);
	};

	const handleCancel = () => {
		router.push(`/workspaces/${workspaceId}/templates`);
	};

	return (
		<TemplateStudio
			onSave={handleSave}
			onCancel={handleCancel}
			initialData={initialData}
		/>
	);
};
