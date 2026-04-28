import { z } from "zod";

export const automationProviderFormSchema = z.object({
  platform: z.enum(["N8N", "MAKE", "ZAPIER", "CUSTOM"]),
  base_url: z.string().optional().or(z.literal("")),
  auth_type: z.enum(["HEADER", "BEARER", "NONE"]).default("HEADER"),
  auth_header_name: z.string().optional().or(z.literal("")),
  auth_secret: z.string().optional().or(z.literal("")),
});

export type AutomationProviderFormData = z.infer<typeof automationProviderFormSchema>;
