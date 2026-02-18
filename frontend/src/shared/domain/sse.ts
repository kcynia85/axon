import { z } from "zod";

export const SSEEventSchema = z.object({
  type: z.enum(["token", "tool", "final", "error"]),
  content: z.string(),
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime().optional(),
});

export type SSEEvent = z.infer<typeof SSEEventSchema>;
