import { z } from "zod";

export const EmbeddingModelStudioSchema = z.object({
    provider_id: z.string().uuid("Wybierz poprawnego dostawcę").optional(),
    model_provider_name: z.string().min(1, "Dostawca jest wymagany"),
    model_id: z.string().min(1, "Model ID jest wymagany"),
    model_vector_dimensions: z.coerce.number().min(1, "Wymiary muszą być większe od 0"),
    model_max_context_tokens: z.coerce.number().min(1, "Max context musi być większy od 0"),
    model_cost_per_1m_tokens: z.coerce.number().min(0, "Koszt nie może być ujemny"),
    is_draft: z.boolean().default(false),
});

export type EmbeddingModelStudioValues = z.infer<typeof EmbeddingModelStudioSchema>;
