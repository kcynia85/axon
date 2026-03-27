import { z } from "zod";

export const RouterPriorityChainItemSchema = z.object({
	id: z.string().uuid().optional(),
	model_id: z.string().min(1, "Model is required"),
	override_params: z.boolean().default(false),
	error_timeout: z.number().min(0).default(30),
});

export const RouterFormSchema = z.object({
	name: z.string().min(1, "Name is required"),
	strategy: z.enum(["fallback", "load_balancer"]).default("fallback"),
	priority_chain: z.array(RouterPriorityChainItemSchema).min(1, "At least one step is required"),
});

export type RouterPriorityChainItem = z.infer<typeof RouterPriorityChainItemSchema>;
export type RouterFormData = z.infer<typeof RouterFormSchema>;
