import { z } from "zod";

const CustomHeaderSchema = z.object({
	key: z.string().min(1, "Klucz jest wymagany"),
	value: z.string().min(1, "Wartość jest wymagana"),
});

const BaseProviderSchema = z.object({
	display_name: z.string().min(1, "Nazwa jest wymagana"),
	provider_id: z.string().min(1, "ID jest wymagane"),
	base_url: z.string().url("Podaj poprawny adres URL"),
	
	// Protocol & Body Config
	protocol: z.enum(["openai", "anthropic", "google", "custom"]).default("openai"),
	
	// Discovery & Auth Configuration (SSoT)
	auth_header_name: z.string().min(1, "Wymagane").default("Authorization"),
	auth_header_prefix: z.string().default("Bearer "),
	api_key_placement: z.enum(["header", "query"]).default("header"),
	
	// Advanced Connection
	custom_headers: z.array(CustomHeaderSchema).default([]),
	
	// Model Discovery Mapping
	discovery_json_path: z.string().min(1, "Wymagane").default("data"),
	discovery_id_key: z.string().min(1, "Wymagane").default("id"),
	discovery_name_key: z.string().min(1, "Wymagane").default("name"),
	discovery_context_key: z.string().min(1, "Wymagane").default("context_length"),
	
	// Response Mapping (Inference)
	response_content_path: z.string().default("choices.0.message.content"),
	response_error_path: z.string().default("error.message"),
	
	json_schema_mapping: z.string().optional(),
});

export const CloudProviderSchema = BaseProviderSchema.extend({
	provider_type: z.literal("cloud"),
	api_key: z.string().min(1, "Klucz API jest wymagany dla dostawców chmurowych"),
	tokenization_strategy: z.enum(["o200k_base", "cl100k_base", "llama", "legacy", "heuristic"]),
});

export const MetaProviderSchema = BaseProviderSchema.extend({
	provider_type: z.literal("meta"),
	api_key: z.string().min(1, "Klucz API jest wymagany"),
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
