import { z } from "zod";

/**
 * Archetype Entity (Draft)
 * Represents a base blueprint or template for other entities.
 */
export const ArchetypeSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Archetype name is required"),
  description: z.string().optional(),
  base_type: z.enum(["entity", "process", "interface", "actor"]).default("entity"),
  attributes: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(["string", "number", "boolean", "object", "array"]),
    default_value: z.any().optional(),
    is_required: z.boolean().default(false),
  })).default([]),
  version: z.string().default("1.0.0"),
  is_draft: z.boolean().default(true),
  tags: z.array(z.string()).default([]),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Archetype = z.infer<typeof ArchetypeSchema>;
