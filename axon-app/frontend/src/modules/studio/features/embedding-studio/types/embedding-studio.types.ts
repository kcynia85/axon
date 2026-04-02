import { z } from "zod";

export const EmbeddingModelStudioSchema = z.object({
    model_provider_name: z.string().min(1, "Dostawca jest wymagany"),
    model_id: z.string().min(1, "Model ID jest wymagany"),
    model_vector_dimensions: z.coerce.number().min(1, "Wymiary muszą być większe od 0"),
    model_max_context_tokens: z.coerce.number().min(1, "Max context musi być większy od 0"),
    model_cost_per_1m_tokens: z.coerce.number().min(0, "Koszt nie może być ujemny"),
});

export type EmbeddingModelStudioValues = z.infer<typeof EmbeddingModelStudioSchema>;
