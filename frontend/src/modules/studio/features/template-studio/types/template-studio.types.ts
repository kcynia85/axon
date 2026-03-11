import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const TemplateItemSchema = z.object({
	name: z.string().min(1, "Name is required"),
	field_type: z.string(),
	is_required: z.boolean().default(false),
});

export type TemplateItem = z.infer<typeof TemplateItemSchema>;

export const TemplateStudioSchema = z.object({
	name: z.string().min(1, "Name is required"),
	goal: z.string().min(1, "Goal is required"),
	description: z.string(),
	keywords: z.array(z.string()).default([]),
	markdown: z.string().default(""),
	context_items: z.array(TemplateItemSchema).default([]),
	artefact_items: z.array(TemplateItemSchema).default([]),
	availability_workspace: z.array(z.string()).default([]),
});

export type TemplateStudioFormData = z.infer<typeof TemplateStudioSchema>;

export type TemplateFormContextType = UseFormReturn<TemplateStudioFormData>;

export type TemplateStudioStep = "discovery" | "design";

export type TemplateStudioState = {
	readonly step: TemplateStudioStep;
	readonly activeSection: string;
};
