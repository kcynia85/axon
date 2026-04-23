import { z } from "zod";
import { VoiceProviderSchema } from "@/shared/domain/system";

export const MetaAgentStudioSchema = z.object({
    // Core settings
    meta_agent_system_prompt: z.string().min(1, "System prompt is required"),
    meta_agent_temperature: z.number().min(0).max(1),
    meta_agent_rag_enabled: z.boolean(),
    llm_model_id: z.string().min(1, "Primary reasoning model is required"),
    
    // Voice settings
    voice_provider: VoiceProviderSchema,
    provider_config: z.record(z.any()).default({}), // The actual validation happens in the domain schema during submission
});

export type MetaAgentStudioData = z.infer<typeof MetaAgentStudioSchema>;
