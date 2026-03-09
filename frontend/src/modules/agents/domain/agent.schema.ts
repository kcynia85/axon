import { z } from "zod";
import { AgentSchema } from "@/shared/domain/workspaces";

export const CreateAgentFormSchema = AgentSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
});

export type CreateAgentFormData = z.infer<typeof CreateAgentFormSchema>;

export type StudioSectionId = "IDENTITY" | "MEMORY" | "ENGINE" | "SKILLS" | "INTERFACE" | "AVAILABILITY";
