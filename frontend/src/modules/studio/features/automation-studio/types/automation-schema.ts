import { z } from "zod";

export const propertySchema = z.object({
	name: z.string().min(1, "Nazwa jest wymagana"),
	field_type: z.enum(["text", "link", "number", "boolean", "date"]),
	is_required: z.boolean().default(false),
});

export const automationFormSchema = z.object({
	definition: z.object({
		name: z.string().min(1, "Nazwa jest wymagana"),
		semanticDescription: z.string().min(1, "Opis jest wymagany"),
		keywords: z.array(z.string()).default([]),
	}),
	connection: z.object({
		platform: z.string().min(1, "Wybierz platformę"),
		method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
		url: z.string().url("Podaj poprawny URL"),
		auth: z.object({
			type: z.string(),
			headerName: z.string().optional(),
			secret: z.string().optional(),
		}),
	}),
	dataInterface: z.object({
		context: z.array(propertySchema).default([]),
		artefacts: z.array(propertySchema).default([]),
	}),
	availability: z.array(z.string()).default([]),
});

export type AutomationFormData = z.infer<typeof automationFormSchema>;
export type AutomationProperty = z.infer<typeof propertySchema>;
