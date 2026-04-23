import { z } from "zod";

export const MetaAgentStudioSchema = z.object({
    meta_agent_system_prompt: z.string().min(1, "System prompt is required"),
    meta_agent_temperature: z.number().min(0).max(1),
    meta_agent_rag_enabled: z.boolean(),
    llm_model_id: z.string().min(1, "Primary reasoning model is required"),
});

export type MetaAgentStudioData = z.infer<typeof MetaAgentStudioSchema>;
