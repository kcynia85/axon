import { z } from "zod";

export const SystemEmbeddingSchema = z.object({
    id: z.string().uuid(),
    entity_id: z.string().uuid(),
    entity_type: z.string(),
    payload: z.record(z.any()),
    updated_at: z.string().optional().nullable(),
});

export type SystemEmbedding = z.infer<typeof SystemEmbeddingSchema>;

export const MetaAgentSchema = z.object({
    id: z.string().uuid(),
    meta_agent_system_prompt: z.string(),
    meta_agent_temperature: z.number().default(0.7),
    meta_agent_rag_enabled: z.boolean().default(true),
    meta_agent_system_knowledge_rags: z.array(z.record(z.any())).default([]),
    llm_model_id: z.string().uuid().optional().nullable(),
});

export type MetaAgent = z.infer<typeof MetaAgentSchema>;

export const SystemAwarenessSettingsSchema = z.object({
    id: z.string().uuid(),
    embedding_model_id: z.string().uuid().optional().nullable(),
    indexing_enabled: z.boolean().default(true),
    realtime_sync_enabled: z.boolean().default(true),
});

export type SystemAwarenessSettings = z.infer<typeof SystemAwarenessSettingsSchema>;

export const VoiceProviderSchema = z.enum(["ElevenLabs", "Inworld_AI", "Cartesia", "Google_Cloud", "Microsoft_Azure", "Amazon_Polly"]);
export type VoiceProvider = z.infer<typeof VoiceProviderSchema>;

export const ElevenLabsConfigSchema = z.object({
    voice_id: z.string(),
    stability: z.number().min(0).max(1).default(0.5),
    similarity_boost: z.number().min(0).max(1).default(0.75),
    style: z.number().min(0).max(1).default(0.0),
    use_speaker_boost: z.boolean().default(true)
});

export const InworldAIConfigSchema = z.object({
    character_id: z.string(),
    scene_id: z.string().optional().nullable()
});

export const CartesiaConfigSchema = z.object({
    voice_id: z.string(),
    model_id: z.string().default("sonic-english")
});

export const GoogleCloudConfigSchema = z.object({
    voice_id: z.string(),
    language_code: z.string().default("en-US")
});

export const MicrosoftAzureConfigSchema = z.object({
    voice_id: z.string(),
    language_code: z.string().default("en-US")
});

export const AmazonPollyConfigSchema = z.object({
    voice_id: z.string(),
    engine: z.string().default("neural"),
    language_code: z.string().default("en-US")
});

export type ElevenLabsConfig = z.infer<typeof ElevenLabsConfigSchema>;
export type InworldAIConfig = z.infer<typeof InworldAIConfigSchema>;
export type CartesiaConfig = z.infer<typeof CartesiaConfigSchema>;
export type HyperscalerConfig = z.infer<typeof GoogleCloudConfigSchema>; // Shared structure for the hyperscalers

export const VoiceMetaAgentSchema = z.discriminatedUnion("voice_provider", [
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("ElevenLabs"),
        provider_config: ElevenLabsConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    }),
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("Inworld_AI"),
        provider_config: InworldAIConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    }),
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("Cartesia"),
        provider_config: CartesiaConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    }),
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("Google_Cloud"),
        provider_config: GoogleCloudConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    }),
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("Microsoft_Azure"),
        provider_config: MicrosoftAzureConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    }),
    z.object({
        id: z.string().uuid(),
        voice_provider: z.literal("Amazon_Polly"),
        provider_config: AmazonPollyConfigSchema,
        meta_agent_system_prompt: z.string().optional().nullable(),
    })
]);

export type VoiceMetaAgent = z.infer<typeof VoiceMetaAgentSchema>;

