import { z } from "zod";

export const ModelCustomParamSchema = z.object({
	key: z.string().min(1, "Key is required"),
	value: z.string(),
	type: z.enum(["String", "Int", "Boolean"]).default("String"),
});

export const ModelFormSchema = z.object({
	provider_id: z.string().min(1, "Dostawca jest wymagany"),
	model_id: z.string().min(1, "Model jest wymagany"),
	alias_name: z.string().optional(),
	reasoning_effort: z.enum(["Low", "Medium", "High"]).default("Medium"),
	max_completion_tokens: z.number().int().min(1, "Musi być większe od 0").default(32000),
	temperature: z.number().min(0).max(2).default(1),
	top_p: z.number().min(0).max(1).default(1),
	custom_params: z.array(ModelCustomParamSchema).default([]),
	system_prompt: z.string().optional(),
	pricing_input: z.number().min(0).default(0),
	pricing_output: z.number().min(0).default(0),
});

export type ModelCustomParam = z.infer<typeof ModelCustomParamSchema>;
export type ModelFormData = z.infer<typeof ModelFormSchema>;
