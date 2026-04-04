import { z } from "zod";
import { ChunkingMethodSchema } from "@/shared/domain/settings";

export const ChunkingStrategyStudioSchema = z.object({
    strategy_name: z.string().min(1, "Nazwa jest wymagana"),
    strategy_chunking_method: ChunkingMethodSchema,
    strategy_chunk_size: z.coerce.number().min(1, "Rozmiar musi być większy od 0"),
    strategy_chunk_overlap: z.coerce.number().min(0, "Nakładka nie może być ujemna"),
    strategy_chunk_boundaries: z.object({
        separators: z.array(z.string()).default(["\\n\\n", "\\n", " "]),
    }).default({ separators: ["\\n\\n", "\\n", " "] }),
    is_draft: z.boolean().default(false),
});

export type ChunkingStrategyStudioValues = z.infer<typeof ChunkingStrategyStudioSchema>;
