import { z } from "zod";

export const propertySchema = z.object({
	name: z.string().min(1, "Nazwa jest wymagana"),
	field_type: z.enum(["text", "string", "link", "number", "boolean", "date", "json", "file", "markdown", "image"]),
	is_required: z.boolean().default(false),
});

export const automationFormSchema = z.object({
	definition: z.object({
		name: z.string().min(1, "Nazwa jest wymagana"),
		semanticDescription: z.string().optional().or(z.literal("")),
		keywords: z.array(z.string()).default([]),
	}),
	connection: z.object({
		platform: z.string().min(1, "Wybierz platformę"),
		method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).default("POST"),
		url: z.string().min(1, "Podaj adres URL"),
		automationProviderId: z.string().uuid().nullable().optional(),
		auth: z.object({
			type: z.string().default("none"),
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
