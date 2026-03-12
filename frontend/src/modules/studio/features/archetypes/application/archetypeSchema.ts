import { z } from "zod";

export const archetypeSchema = z.object({
	role: z.string().min(1, "Role is required"),
	goal: z.string().min(1, "Goal is required"),
	backstory: z.string().min(1, "Backstory is required"),
	keywords: z.array(z.string()),
	knowledgeHubIds: z.array(z.string()),
	instructions: z.array(z.string()),
	constraints: z.array(z.string()),
	isGlobalAccess: z.boolean(),
	workspaceIds: z.array(z.string()),
});

export type ArchetypeFormValues = z.infer<typeof archetypeSchema>;
