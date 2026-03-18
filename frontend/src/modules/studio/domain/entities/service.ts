import { z } from "zod";

/**
 * Service Entity (Draft)
 * Represents a business or technical service in the Axon ecosystem.
 */
export const ServiceSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(5, "Description is too short").optional(),
  category: z.enum(["technical", "business", "integration"]).default("business"),
  is_draft: z.boolean().default(true),
  metadata: z.record(z.string(), z.any()).default({}),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Service = z.infer<typeof ServiceSchema>;
