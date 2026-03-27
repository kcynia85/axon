import { z } from "zod";

const BaseProviderSchema = z.object({
	display_name: z.string().min(1, "Nazwa jest wymagana"),
	provider_id: z.string().min(1, "ID jest wymagane"),
	base_url: z.string().url("Podaj poprawny adres URL"),
	json_schema_mapping: z.string().optional(),
	api_adapter_mapping: z.array(
		z.object({
			axon_key: z.string(),
			provider_key: z.string(),
		})
	).optional(),
});

export const CloudProviderSchema = BaseProviderSchema.extend({
	provider_type: z.literal("cloud"),
	api_key: z.string().min(1, "Klucz API jest wymagany dla dostawców chmurowych"),
	tokenization_strategy: z.enum(["o200k_base", "cl100k_base", "llama", "legacy", "heuristic"]),
});

export const MetaProviderSchema = BaseProviderSchema.extend({
	provider_type: z.literal("meta"),
	api_key: z.string().min(1, "Klucz API jest wymagany"),
	custom_headers: z.object({
		http_referer: z.string().optional(),
		x_title: z.string().optional(),
	}).optional(),
	tokenization_strategy: z.literal("auto_detect"),
	tokenization_fallback: z.enum(["cl100k_base", "heuristic"]),
});

export const LocalProviderSchema = BaseProviderSchema.extend({
	provider_type: z.literal("local"),
	api_key: z.string().optional(),
	tokenization_strategy: z.enum(["o200k_base", "cl100k_base", "llama", "legacy", "heuristic"]),
	billing_model: z.enum(["zero_hardware", "manual_rate"]),
});

export const ProviderFormSchema = z.discriminatedUnion("provider_type", [
	CloudProviderSchema,
	MetaProviderSchema,
	LocalProviderSchema,
]);

export type ProviderFormData = z.infer<typeof ProviderFormSchema>;
export type ProviderType = ProviderFormData["provider_type"];
