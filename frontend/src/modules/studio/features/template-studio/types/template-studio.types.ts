import { z } from "zod";
import type { UseFormReturn } from "react-hook-form";

export const TemplateItemSchema = z.object({
	name: z.string().min(1, "Name is required"),
	field_type: z.string(),
	is_required: z.boolean().default(false),
});

export type TemplateItem = z.infer<typeof TemplateItemSchema>;

export const TemplateChecklistItemSchema = z.object({
	id: z.string(),
	label: z.string().min(1, "Label is required"),
	description: z.string().optional(),
	isCompleted: z.boolean().default(false),
	subactions: z.array(z.object({
		id: z.string(),
		label: z.string().min(1, "Label is required"),
		isCompleted: z.boolean().default(false)
	})).default([]),
});

export type TemplateChecklistItem = z.infer<typeof TemplateChecklistItemSchema>;

export const TemplateStudioSchema = z.object({
	name: z.string().min(1, "Name is required"),
	description: z.string().min(10, "Description must be at least 10 characters"),
	keywords: z.array(z.string()).default([]),
	markdown: z.string().default(""),
	context_items: z.array(TemplateItemSchema)
		.default([])
		.refine((items) => {
			const names = items.map(i => i.name.trim().toLowerCase());
			return new Set(names).size === names.length;
		}, { message: "Context item names must be unique" }),
	artefact_items: z.array(TemplateItemSchema)
		.default([])
		.refine((items) => {
			const names = items.map(i => i.name.trim().toLowerCase());
			return new Set(names).size === names.length;
		}, { message: "Artefact item names must be unique" }),
	availability_workspace: z.array(z.string()).default([]),
});

export type TemplateStudioFormData = z.infer<typeof TemplateStudioSchema>;

export type TemplateFormContextType = UseFormReturn<TemplateStudioFormData>;

export type TemplateStudioStep = "discovery" | "design";

export type TemplateStudioState = {
	readonly step: TemplateStudioStep;
	readonly activeSection: string;
};
