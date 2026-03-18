import { z } from "zod";

/**
 * Automation Entity (Draft)
 * Represents an automated workflow, trigger, or routine.
 */
export const AutomationSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Automation name is required"),
  trigger_type: z.enum(["event", "cron", "manual"]).default("manual"),
  trigger_config: z.record(z.string(), z.any()).default({}),
  steps: z.array(z.object({
    id: z.string(),
    type: z.string(),
    config: z.record(z.string(), z.any()),
  })).default([]),
  is_active: z.boolean().default(false),
  is_draft: z.boolean().default(true),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Automation = z.infer<typeof AutomationSchema>;
