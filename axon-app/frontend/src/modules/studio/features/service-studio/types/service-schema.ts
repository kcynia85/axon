import { z } from "zod";

export const ServiceCapabilitySchema = z.object({
	id: z.string().optional(),
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
});

export const ServiceStudioSchema = z.object({
	name: z.string().min(1, "Service name is required"),
	url: z.string()
		.min(1, "Connection URL is required")
		.url("Must be a valid URL (e.g. https://api.service.com)")
		.regex(/^https?:\/\//, "URL must start with http:// or https://"),
	business_context: z.string().optional(),
	keywords: z.array(z.string()).default([]),
	categories: z.array(z.string()).default([]),
	capabilities: z.array(ServiceCapabilitySchema).default([]),
	availability: z.array(z.string()).default(["Global"]),
});

export type ServiceCapabilityData = z.infer<typeof ServiceCapabilitySchema>;
export type ServiceStudioFormData = z.infer<typeof ServiceStudioSchema>;
